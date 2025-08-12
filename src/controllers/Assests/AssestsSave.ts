import { Request, Response } from "express";
import { ASSETS_ERROR_MESSAGES, ERROR_CODES, ERROR_MESSAGES } from "../../constants/errorMessages";
import supabase from "../../config/client";
import { randomUUID } from "crypto";

const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;

function validateImage(file: Express.Multer.File) {
  if (!allowedTypes.includes(file.mimetype as typeof allowedTypes[number])) {
    throw new Error(ASSETS_ERROR_MESSAGES.ONLY_ALLOWED);
  }
}

async function uploadImageToBucket(file: Express.Multer.File): Promise<{ url: string, name: string }> {
  const fileExt = file.originalname.split(".").pop();
  const fileName = `${randomUUID()}.${fileExt}`;
  const filePath = `assets/${fileName}`;

  const { error } = await supabase.storage
    .from("assets-bucket")
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    throw new Error(ASSETS_ERROR_MESSAGES.UPLOAD_FAILED);
  }

  const { data } = supabase.storage.from("assets-bucket").getPublicUrl(filePath);
  return { url: data.publicUrl, name: fileName };
}

export async function AssetsSave(req: Request, res: Response) {
  try {
    const {
      title,
      category_id,
      description,
      price,
      followers,
      engagement_rate,
      monthly_view,
      monthly_revenue,
    } = req.body;

    const user_id = req.user?.id;
    const imageFile = req.file as Express.Multer.File;

    if (!title || !category_id || !price || !imageFile || !user_id) {
      return res.status(ERROR_CODES.BAD_REQUEST).json({ error: ASSETS_ERROR_MESSAGES.BAD_REQUEST });
    }

    validateImage(imageFile);

    // Step 1: Insert asset
    const { data: asset, error: assetErr } = await supabase
      .from("assets")
      .insert([{
        user_id:user_id,
        asset_title: title,
        category_id: Number(category_id),
        description,
        price,
        followers_subscribers: followers.toString(),
        engagement_rate: engagement_rate.toString(),
        monthly_view,
        monthly_revenue
      }])
      .select()
      .single();

    if (assetErr) throw assetErr;

    // Step 2: Upload image to bucket
    const { url, name } = await uploadImageToBucket(imageFile);

    // Step 3: Insert into asset_images
    const { error: imgErr } = await supabase
      .from("asset_images")
      .insert([{
        asset_id: asset.id,
        user_id,
        file_name: name,
        file_url: url,
        mime_type: imageFile.mimetype
      }]);

    if (imgErr) throw imgErr;

    return res.status(ERROR_CODES.SUCCESS).json({
      message: ASSETS_ERROR_MESSAGES.MESSAGE,
      asset
    });

  } catch (err) {
    console.error("❌ Exception:", err);
    return res.status(ERROR_CODES.SERVER_ERROR).json({
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
