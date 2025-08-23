"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
import { createClient } from "@supabase/supabase-js";
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const supabaseUrl = "https://yyjbodjegiygudcjqyiw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5amJvZGplZ2l5Z3VkY2pxeWl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NzU5MDEsImV4cCI6MjA3MDA1MTkwMX0.PXvajSant0QqlzUsAwsWdQEd4lo1YmlKJOtvCIHgy0M";
if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase credentials in environment variables.");
}
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
exports.default=supabase;