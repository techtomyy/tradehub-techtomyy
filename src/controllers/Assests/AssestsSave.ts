import { Request, Response } from "express";
import { ASSETS_ERROR_MESSAGES, STATUS_CODES } from "../../constants/errorMessages";
import supabase from "../../config/client";
import { uploadImageToBucket, validateImage } from "./SaveImageBucket";

interface UserPayload {
  id?: string;
  name: string;
  email?: string;
  role?: string;
}

interface Assets {
  title: string;
  category_name: string;
  description: string;
  price: number;
  followers: number;
  engagement_rate: number;
  monthly_view: number;
  monthly_revenue: number;
}

export async function AssetsSave(req: Request<{}, {}, Assets>, res: Response): Promise<Response> {
  try {
    const {
      title,
      category_name,
      description,
      price,
      followers,
      engagement_rate,
      monthly_view,
      monthly_revenue,
    } = req.body;

    // User payload from request
    const user = (req as Request & { user?: UserPayload }).user;
    if (!user) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({ error: ASSETS_ERROR_MESSAGES.BAD_REQUEST });
    }
    const { id: user_id, name, email } = user;

    const imageFile = req.file as Express.Multer.File;

    // Validate required fields
    if (!title || !category_name || !price || !imageFile || !user_id) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error: ASSETS_ERROR_MESSAGES.BAD_REQUEST });
    }

    // Validate image
    validateImage(imageFile);

    // Insert into userdetails (if needed)
    const { error: userDetailsErr } = await supabase
      .from("usersdetail")
      .insert([{ id:user_id, name:category_name, email }])
      .select()
      .single();

    if (userDetailsErr) {
      console.error("Userdetails insert error:", userDetailsErr);
      // You can decide to throw or handle gracefully
    }

    const { error: categoriesDetailsErr } = await supabase
      .from("categories")
      .insert([{ id:user_id,category_name:category_name }])
      .select()
      .single();

    if (categoriesDetailsErr) {
      console.error("Userdetails insert error:", userDetailsErr);
      // You can decide to throw or handle gracefully
    }

    // Insert asset
    const { data: asset, error: assetErr } = await supabase
      .from("assets")
      .insert([
        {
          user_id,
          asset_title: title,
          category_name:category_name,
          description,
          price,
          followers_subscribers: followers.toString(),
          engagement_rate: engagement_rate.toString(),
          monthly_view,
          monthly_revenue,
        },
      ])
      .select()
      .single();

    if (assetErr) throw assetErr;

    // Upload image to bucket
    const { url, name: fileName } = await uploadImageToBucket(imageFile);

    // Insert into asset_images
    const { error: imgErr } = await supabase
      .from("asset_images")
      .insert([
        {
          asset_id: asset.id,
          user_id,
          file_name: fileName,
          file_url: url,
          mime_type: imageFile.mimetype,
        },
      ]);

    if (imgErr) throw imgErr;

    return res.status(STATUS_CODES.SUCCESS).json({
      message: ASSETS_ERROR_MESSAGES.MESSAGE,
      asset,
    });
  } catch (err) {
    console.error("❌ Exception:", err);
    return res.status(STATUS_CODES.SERVER_ERROR).json({
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
