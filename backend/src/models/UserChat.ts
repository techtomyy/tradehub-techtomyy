import supabase from '../config/client';

export const chatTables = async () => {

  // Chats table
  const chatsTable = `
CREATE TABLE IF NOT EXISTS public.chats (
  chat_id SERIAL PRIMARY KEY,
  chat_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);`;

  // Messages table
  const messagesTable = `
CREATE TABLE IF NOT EXISTS public.messages (
  message_id SERIAL PRIMARY KEY DEFAULT gen_random_uuid() ,
  chat_id INT REFERENCES public.chats(chat_id) ON DELETE CASCADE,
  sender_id INT NOT NULL, -- assign from JSON token in backend
  receiver_id INT NOT NULL, -- assign from backend logic
  message_text TEXT,
  digital_asset_url VARCHAR(255),
  is_read BOOLEAN  DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);`;

  // Execute chats table query
  const { error: chatsError } = await supabase.rpc('execute_sql', { sql: chatsTable });
  if (chatsError) return console.error("❌ Chats table error:", chatsError.message);

  // Execute messages table query
  const { error: messagesError } = await supabase.rpc('execute_sql', { sql: messagesTable });
  if (messagesError) return console.error("❌ Messages table error:", messagesError.message);

  console.log("✅ Chats and Messages tables created successfully!");
};
