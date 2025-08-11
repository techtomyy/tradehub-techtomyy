import { Request, Response } from "express";
import { ERROR_MESSAGES,ERROR_CODES } from "../../constants/errorMessages";
import supabase from "../../config/client";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/generateToken";

interface LoginBody {
  email: string;
  password: string;
}

export async function LoginUser(
  req: Request<{}, {}, LoginBody>,
  res: Response
): Promise<Response> {
  try {
    const { email, password } = req.body;

    // 1. Get user by email from 'users' table
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, email")
      .eq("email", email)
      .maybeSingle();

    if (userError) {
      console.error("❌ Error fetching user:", userError.message);
      return res.status(500).json({ error: ERROR_MESSAGES.AUTH.SERVER_ERROR });
    }

    if (!user) {
      return res
        .status(ERROR_CODES.NOT_FOUND)
        .json({ error: ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS_EMAIL });
    }

    // 2. Get hashed password from auth table
    const { data: authData, error: authError } = await supabase
      .from("auth")
      .select("password")
      .eq("user_id", user.id)
      .maybeSingle();

    if (authError || !authData) {
      console.error("❌ Error fetching password:", authError?.message);
      return res.status(ERROR_CODES.UNAUTHORIZED).json({ error: ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, authData.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ error: ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS_PASSWORD });
    }

    // 4. Get role
    const { data: roleData, error: roleError } = await supabase
      .from("roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (roleError || !roleData) {
      console.error("❌ Error fetching role:", roleError?.message);
      return res.status(ERROR_CODES.SERVER_ERROR).json({ error: ERROR_MESSAGES.AUTH.SERVER_ERROR });
    }

    // 5. Generate Token
    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: roleData.role,
    };
    const token = generateToken(tokenPayload);

    // 6. Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    // 7. Return success
    return res.status(ERROR_CODES.SUCCESS).json({ message: "✅ Login successful!" });

  } catch (error) {
    console.error("❌ Login Error:", error);
    return res.status(500).json({ error: ERROR_MESSAGES.AUTH.SERVER_ERROR });
  }
}
