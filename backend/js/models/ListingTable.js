"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAssestsTable = createAssestsTable;
const client_1 = __importDefault(require("../config/client"));
function createAssestsTable() {
    return __awaiter(this, void 0, void 0, function* () {
        const createUsersTableSql = `
    CREATE TABLE IF NOT EXISTS public.usersdetail (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL
    );`;
        const categoriesTableSql = `CREATE TABLE IF NOT EXISTS public.categories (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES usersdetail(id) ON DELETE CASCADE,
    category_name TEXT NOT NULL
);
`;
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
);`;
        const assetimagesTableSql = `CREATE TABLE IF NOT EXISTS public.asset_images (
    id SERIAL PRIMARY KEY,
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES usersdetail(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT NOW()
);
    `;
        // Run each query
        const { error: usersError } = yield client_1.default.rpc('execute_sql', { sql: createUsersTableSql });
        if (usersError)
            return console.error("❌ Users table error:", usersError.message);
        const { error: categoriesError } = yield client_1.default.rpc('execute_sql', { sql: categoriesTableSql });
        if (categoriesError)
            return console.error("❌category error:", categoriesError.message);
        const { error: assetsError } = yield client_1.default.rpc('execute_sql', { sql: assestsTableSql });
        if (assetsError)
            return console.error("❌ assets error:", assetsError.message);
        const { error: assestImageError } = yield client_1.default.rpc('execute_sql', { sql: assetimagesTableSql });
        if (assestImageError)
            return console.error("❌ assestImage error:", assestImageError.message);
    });
}
