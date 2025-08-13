import supabase from '../config/client'

export async function createAssestsTable() {
    const createUsersTableSql = `
    CREATE TABLE IF NOT EXISTS public.usersdetail (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL
    );`

    const categoriesTableSql = `CREATE TABLE IF NOT EXISTS public.categories (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES usersdetail(id) ON DELETE CASCADE,
    category_name TEXT NOT NULL
);
`
    const assestsTableSql = `CREATE TABLE IF NOT EXISTS public.assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES usersdetail(id) ON DELETE CASCADE,
    asset_title TEXT NOT NULL,
    category_name TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL,
    followers_subscribers TEXT NOT NULL,
    engagement_rate TEXT NOT NULL,
    monthly_view INT,
    monthly_revenue NUMERIC
);`

    const assetimagesTableSql = `CREATE TABLE IF NOT EXISTS public.asset_images (
    id SERIAL PRIMARY KEY,
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES usersdetail(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT NOW()
);
    `
    // Run each query
    const { error: usersError } = await supabase.rpc('execute_sql', { sql: createUsersTableSql });
    if (usersError) return console.error("❌ Users table error:", usersError.message);

    const { error: categoriesError } = await supabase.rpc('execute_sql', { sql: categoriesTableSql });
    if (categoriesError) return console.error("❌category error:", categoriesError.message);


    const { error: assetsError } = await supabase.rpc('execute_sql', { sql: assestsTableSql });
    if (assetsError) return console.error("❌ assets error:", assetsError.message);

    const { error: assestImageError } = await supabase.rpc('execute_sql', { sql: assetimagesTableSql });
    if (assestImageError) return console.error("❌ assestImage error:", assestImageError.message);


}

