import { Socket } from "socket.io";
import jwt, { JwtPayload } from "jsonwebtoken";
import cookie from "cookie";

interface DecodedToken extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

export const socketAuth = (socket: Socket, next: (err?: Error) => void) => {
  const cookies = socket.handshake.headers.cookie;
  console.log(cookies)
  if (!cookies) return next(new Error("❌ No cookies found"));

  const parsedCookies = cookie.parse(cookies);
  const token = parsedCookies.token;

  if (!token) return next(new Error("❌ No token in cookies"));

  try {
    const decoded = jwt.verify(
      token,
      process.env.ADMIN_SECRET_KEY as string
    ) as DecodedToken;

    if (decoded.role === "user") {
      console.log("✅ user authenticated:", decoded.email);

      // save decoded user inside socket
      (socket as any).user = decoded;
      next();
    } else {
      next(new Error("❌ Invalid role"));
    }
  } catch (err: any) {
    console.error("JWT Error:", err.message);
    next(new Error("❌ Invalid token"));
  }
};
