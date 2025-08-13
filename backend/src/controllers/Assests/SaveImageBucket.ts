import supabase from "../../config/client";
import { randomUUID } from "crypto";
import { ASSETS_ERROR_MESSAGES, STATUS_CODES, ERROR_MESSAGES } from "../../constants/errorMessages";


const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;

export function validateImage(file: Express.Multer.File) {
  if (!allowedTypes.includes(file.mimetype as typeof allowedTypes[number])) {
    throw new Error(ASSETS_ERROR_MESSAGES.ONLY_ALLOWED);
  }
}

export async function uploadImageToBucket(file: Express.Multer.File): Promise<{ url: string, name: string }> {
  const fileExt = file.originalname.split(".").pop();
  const fileName = `${randomUUID()}.${fileExt}`;
  const filePath = `assets/${fileName}`;

  const { error } = await supabase.storage
    .from("assets")
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
