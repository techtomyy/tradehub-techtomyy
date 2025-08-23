import supabase from '../config/client';

export const chatTables = async () => {


  // Messages table
  const messagesTable = `
CREATE TABLE IF NOT EXISTS public.messages (
  message_id SERIAL PRIMARY KEY DEFAULT gen_random_uuid() ,
  sender_id INT NOT NULL, -- assign from JSON token in backend
  receiver_id INT NOT NULL, -- assign from backend logic
  message_text TEXT,
  digital_asset_url VARCHAR(255),
  is_read BOOLEAN  DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);`;
  // Execute messages table query
  const { error: messagesError } = await supabase.rpc('execute_sql', { sql: messagesTable });
  if (messagesError) return console.error("❌ Messages table error:", messagesError.message);

  console.log("✅ Chats and Messages tables created successfully!");
};
