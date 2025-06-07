import { SignJWT } from "jose";

export async function createTestJWTToken(payload: {
  sub: string;
  email: string;
}): Promise<string> {
  const encoder = new TextEncoder();
  const secretKey = encoder.encode("test-secret-key-for-testing-purposes-only");

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secretKey);

  return token;
}

export const testUserPayload = {
  sub: "test-user-id",
  email: "test@example.com",
};
