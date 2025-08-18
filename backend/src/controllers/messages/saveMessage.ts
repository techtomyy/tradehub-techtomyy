import supabase from "../../config/client.js";
import { MessagePayload } from "../../types/Message.js";
export const saveMessageDB = async (message:MessagePayload) => {
  try {
    // Supabase insert
    const { data, error } = await supabase
      .from("messages")
      .insert([message]) // message = { sender_id, receiver_id, text, ... }
      .select();

    if (error) throw error;

    return data[0]; // inserted row return karein
  } catch (error:any) {
    console.error("Error saving message:", error.message);
    throw error;
  }
};
