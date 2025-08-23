import { Request, Response } from "express";
import supabase from "../../config/client";
import { ERROR_MESSAGES, STATUS_CODES } from "../../constants/errorMessages";
import { generateToken } from "../../utils/generateToken";

export async function LoginWithGoogle(req: Request, res: Response): Promise<Response> {
  try {
    const tokenHeader = req.headers.authorization?.replace("Bearer ", "");
    console.log(tokenHeader)
    if (!tokenHeader) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({ error: ERROR_MESSAGES.GOOGLE.TOKEN_MISSING });
    }

    // 1. Get user from Supabasen
    const { data, error } = await supabase.auth.getUser(tokenHeader);
    if (error || !data?.user) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({ error: ERROR_MESSAGES.GOOGLE.INVALID_TOKEN });
    }

    const { id, email, user_metadata } = data.user;
    const fullName = user_metadata?.full_name || "Unknown User";
    const firstName = fullName.split(" ")[0] || "";
    const lastName = fullName.split(" ").slice(1).join(" ") || "";

    // 2. Check if user exists
    let { data: existingUser, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (userError) {
      return res.status(STATUS_CODES.SERVER_ERROR).json({ error: `${ERROR_MESSAGES.DB.USERS_TABLE_ERROR}: ${userError.message}` });
    }

    let userId;
    if (!existingUser) {
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert([{ email, firstName, lastName, conditionagree: true }])
        .select("id")
        .single();

      if (insertError) {
        return res.status(STATUS_CODES.SERVER_ERROR).json({ error: `${ERROR_MESSAGES.DB.USERS_INSERT_ERROR}: ${insertError.message}` });
      }
      userId = newUser.id;
    } else {
      userId = existingUser.id;
    }

    // 3. Auth table update
    const { error: authError } = await supabase
      .from("auth")
      .upsert([{ user_id: userId, googleid: id, isPasswordset: false }], { onConflict: "user_id" });

    if (authError) {
      return res.status(STATUS_CODES.SERVER_ERROR).json({ error: `${ERROR_MESSAGES.DB.AUTH_TABLE_ERROR}: ${authError.message}` });
    }

    // 4. Roles table update
    const { data: roleExists } = await supabase
      .from("roles")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!roleExists) {
      const { error: roleError } = await supabase
        .from("roles")
        .insert([{ user_id: userId, role: "User" }]);

      if (roleError) {
        return res.status(STATUS_CODES.SERVER_ERROR).json({ error: `${ERROR_MESSAGES.DB.ROLES_TABLE_ERROR}: ${roleError.message}` });
      }
    }

    // 5. Fetch role
    const { data: roleData, error: fetchRoleError } = await supabase
      .from("roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    if (fetchRoleError || !roleData) {
      return res.status(STATUS_CODES.SERVER_ERROR).json({ error: ERROR_MESSAGES.DB.ROLES_FETCH_ERROR });
    }

    // 6. Generate JWT
    const jwtToken = generateToken({
      id,
      email: email || "",
      role: roleData.role
    });

    // 7. Set cookie
    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: ERROR_MESSAGES.GOOGLE.MESSAGE_SUCCESS,
      user: { id, email, firstName, lastName, role: roleData.role }
    });

  } catch (err) {
    console.error("Google login error:", err);
    return res.status(STATUS_CODES.SERVER_ERROR).json({ error: ERROR_MESSAGES.AUTH.SERVER_ERROR });
  }
}
