import supabase from '../supabase/client.js'

const createTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT now()
    );
  `

  const { error } = await supabase.rpc('execute_sql', { sql })

  if (error) console.error('Error creating table:', error.message)
  else console.log('✅ Table created successfully')
}

createTable()
