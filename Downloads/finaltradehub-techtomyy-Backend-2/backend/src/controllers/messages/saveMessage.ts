import supabase from "../../config/client.js";
import { MessagePayload } from "../../types/Sockets";

export const saveMessageDB = async (message: MessagePayload) => {
  try {
    // 👇 insert only specific columns jo tumhare table me hain
    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          chat_id: message.chat_id,
          sender_id: message.sender_id,
          receiver_id: message.receiver_id,
          message_text: message.message_text,
          is_read: message.is_read ?? false,
        },
      ])
      .select();

    if (error) throw error;

    return data[0]; // ✅ return inserted row
  } catch (error: any) {
    console.error("❌ Error saving message:", error.message);
    throw error;
  }
};
