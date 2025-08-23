import { Request, Response } from "express";
import supabase from "../config/client.js";

export const getSettings = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { data, error } = await supabase
      .from("settings")
      .select("*");

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    return res.status(200).json({ success: true, settings: data });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
