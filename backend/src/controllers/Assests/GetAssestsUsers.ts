import { Request, Response } from "express";
import supabase from "../../config/client";
import { ASSETS_ERROR_MESSAGES, ERROR_MESSAGES, STATUS_CODES } from "../../constants/errorMessages";

interface UserPayload {
    id: string;
    email: string;
    role: string;
}

const bucketName = "assets";

export async function getUserAssets(req: Request, res: Response): Promise<Response> {
    const user = (req as Request & { user?: UserPayload }).user;

    if (!user) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            message: ASSETS_ERROR_MESSAGES.NOT_USER_INFO
        });
    }

    const { id: user_id } = user;

    try {
        // Step 1: Fetch assets of the user
        const { data: assets, error: assetsError } = await supabase
            .from("assets")
            .select("*")
            .eq("user_id", user_id);

        if (assetsError) throw assetsError;

        // Step 2: Fetch images for each asset from asset_images table
        const assetsWithImages = await Promise.all(
            assets.map(async (asset: any) => {
                const { data: images, error: imagesError } = await supabase
                    .from("asset_images")
                    .select("*")
                    .eq("asset_id", asset.id);

                if (imagesError) throw imagesError;

                const imagesWithUrls = images.map((img: any) => {
                    const { data } = supabase
                        .storage
                        .from(bucketName)
                        .getPublicUrl(img.file_name);

                    return {
                        ...img,
                        publicUrl: data.publicUrl
                    };
                });

                return {
                    ...asset,
                    images: imagesWithUrls
                };
            })
        );

        return res.status(STATUS_CODES.SUCCESS).json({
            message:ASSETS_ERROR_MESSAGES.ASSETS_FETCH,
            assets: assetsWithImages
        });

    } catch (err) {
        console.error("❌ Exception:", err);
        return res.status(STATUS_CODES.SERVER_ERROR).json({
            error: err instanceof Error ? err.message : "Unknown error"
        });
    }
}
