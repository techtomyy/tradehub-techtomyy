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
exports.SignupTable = void 0;
const client_1 = __importDefault(require("../config/client"));
const SignupTable = () => __awaiter(void 0, void 0, void 0, function* () {
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
    const { error: enumError } = yield client_1.default.rpc('execute_sql', { sql: createEnumSql });
    if (enumError)
        return console.error("❌ Enum error:", enumError.message);
    const { error: usersError } = yield client_1.default.rpc('execute_sql', { sql: createUsersTableSql });
    if (usersError)
        return console.error("❌ Users table error:", usersError.message);
    const { error: authError } = yield client_1.default.rpc('execute_sql', { sql: createAuthTableSql });
    if (authError)
        return console.error("❌ Auth table error:", authError.message);
    const { error: rolesError } = yield client_1.default.rpc('execute_sql', { sql: createRolesTableSql });
    if (rolesError)
        return console.error("❌ Roles table error:", rolesError.message);
    console.log("✅ Normalized user tables created successfully");
});
exports.SignupTable = SignupTable;
