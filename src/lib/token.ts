import jwt from "jsonwebtoken";

//used to auth a user for 1hr with a JWL token. Not currently used but could use later
export function createAccessToken(userId: string): string {
  const payload = {
    userId,
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
  };

  const secret = process.env.SUPABASE_JWT_SECRET;
  if (!secret) throw new Error("Missing SUPABASE_JWT_SECRET");

  return jwt.sign(payload, secret);
}
