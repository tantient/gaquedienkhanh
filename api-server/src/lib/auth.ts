import crypto from "crypto";

const SESSION_TTL = 24 * 60 * 60 * 1000;
export const sessions = new Map<string, number>();

export function createSession(): string {
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, Date.now() + SESSION_TTL);
  return token;
}

export function isValidSession(token: string): boolean {
  const expiry = sessions.get(token);
  if (!expiry) return false;
  if (Date.now() > expiry) {
    sessions.delete(token);
    return false;
  }
  return true;
}

export function requireAuth(
  req: import("express").Request,
  res: import("express").Response
): string | null {
  const auth = req.headers["authorization"];
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token || !isValidSession(token)) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
  return token;
}
