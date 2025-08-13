import supabase from '../config/client'

export const SignupTable = async () => {
  // 1. ENUM creation SQL
  const createEnumSql = `
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('User', 'Admin');
      END IF;
    END$$;
  `;

  // 2. Users Table
  const createUsersTableSql = `
    CREATE TABLE IF NOT EXISTS public.users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      FirstName TEXT NOT NULL,
      LastName TEXT NOT NULL,
      Email TEXT UNIQUE NOT NULL,
      ConditionAgree BOOLEAN NOT NULL,
      Created_at TIMESTAMP DEFAULT now()
    );
  `;

  // 3. Auth Table
  const createAuthTableSql = `
    CREATE TABLE IF NOT EXISTS public.auth (
      user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      Password TEXT,
      IsPasswordSet BOOLEAN DEFAULT FALSE,
      GoogleID TEXT DEFAULT NULL
    );
  `;

  // 4. Roles Table
  const createRolesTableSql = `
    CREATE TABLE IF NOT EXISTS public.roles (
      user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      Role user_role DEFAULT 'User'
    );
  `;

  // Run each query
  const { error: enumError } = await supabase.rpc('execute_sql', { sql: createEnumSql });
  if (enumError) return console.error("❌ Enum error:", enumError.message);

  const { error: usersError } = await supabase.rpc('execute_sql', { sql: createUsersTableSql });
  if (usersError) return console.error("❌ Users table error:", usersError.message);

  const { error: authError } = await supabase.rpc('execute_sql', { sql: createAuthTableSql });
  if (authError) return console.error("❌ Auth table error:", authError.message);

  const { error: rolesError } = await supabase.rpc('execute_sql', { sql: createRolesTableSql });
  if (rolesError) return console.error("❌ Roles table error:", rolesError.message);

  console.log("✅ Normalized user tables created successfully");
};
