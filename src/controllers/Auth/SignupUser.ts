import { Request, Response } from "express";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import supabase from "../../config/client";
import { generateToken } from "../../utils/generateToken";
import bcrypt from "bcrypt";

interface SignupBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  conditionagree: boolean;
}

export async function SignupUser(
  req: Request<{}, {}, SignupBody>,
  res: Response
): Promise<Response> {
  try {
    const { firstName, lastName, email, password, conditionagree } = req.body;
    console.log(req.body)
    // 1. Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (checkError) {
      console.error("❌ Error checking existing user:", checkError.message);
      return res.status(500).json({ error: ERROR_MESSAGES.AUTH.SERVER_ERROR });
    }

    if (existingUser) {
      return res
        .status(400)
        .json({ error: ERROR_MESSAGES.GENERAL.USER_ALREADY_EXISTS });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insert into `users` table
    const { data: userInsert, error: userError } = await supabase
      .from("users")
      .insert([
        {
          firstname: firstName,
          lastname: lastName,
          email: email,
        conditionagree:conditionagree,
        },
      ])
      .select()
      .single();

    if (userError || !userInsert) {
      console.error("❌ Error inserting user:", userError?.message);
      return res
        .status(500)
        .json({ error: ERROR_MESSAGES.GENERAL.SIGNUP_FAILED });
    }

    const userId = userInsert.id;

    // 4. Insert into `auth` table
    const { error: authError } = await supabase.from("auth").insert([
      {
        user_id: userId,
        password: hashedPassword,
        ispasswordset: true,
        googleid: null,
      },
    ]);

    if (authError) {
      console.error("❌ Error inserting auth:", authError.message);
      return res
        .status(500)
        .json({ error: ERROR_MESSAGES.GENERAL.SIGNUP_FAILED });
    }

    // 5. Insert into `roles` table
    const { data: roleAdd, error: roleError } = await supabase
      .from("roles")
      .insert([
        {
          user_id: userId,
          role: "User", // default role
        },
      ])
      .select()
      .single();

    if (roleError || !roleAdd) {
      console.error("❌ Error inserting role:", roleError?.message);
      return res
        .status(500)
        .json({ error: ERROR_MESSAGES.GENERAL.SIGNUP_FAILED });
    }

    // 6. Generate Token
    const user = {
      id: roleAdd.user_id,
      email: email,
      role: roleAdd.role,
    };
    console.log(user)

    const token = generateToken(user);

    // 7. Set Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 6 hours
    });

    return res
      .status(201)
      .json({ message: "✅ User signed up successfully!" });
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    return res.status(500).json({ error: ERROR_MESSAGES.AUTH.SERVER_ERROR });
  }
}
