import { Hono, Context, Next } from "hono";
import { jwtVerify } from "jose";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./trpc/router";
import { z } from "zod";

type Env = {
  Bindings: {
    JWT_SECRET_KEY: string;
    D1: D1Database;
    DB_ACCOUNT_ID: string;
    DB_DATABASE_ID: string;
    DB_TOKEN: string;
  };
  Variables: {
    user: {
      id: string;
      email: string;
    };
  };
};

const jwtPayloadSchema = z.object({
  sub: z.string().min(1),
  email: z.string().email(),
  // 他の必要なフィールド
});

const app = new Hono<Env>();

app.use("/*", async (c: Context<Env>, next: Next) => {
  // Authorizationヘッダーからトークンを取得
  const authHeader = c.req.header("Authorization") || "";
  if (!authHeader.startsWith("Bearer "))
    return c.json({ error: "認証が必要です" }, 401);

  const token = authHeader.split("Bearer ")[1];

  try {
    const encoder = new TextEncoder();
    const secretKey = encoder.encode(c.env.JWT_SECRET_KEY);

    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });

    const validatedPayload = jwtPayloadSchema.parse(payload);

    c.set("user", {
      id: validatedPayload.sub,
      email: validatedPayload.email,
    });

    await next();
  } catch (_e) {
    return c.json({ error: "無効なトークンです" }, 401);
  }
});

app.all("/*", async (c: Context<Env>) => {
  const user = c.get("user");
  const req = c.req.raw;
  const res = await fetchRequestHandler({
    endpoint: "/",
    req,
    router: appRouter,
    createContext: () => ({ user }),
  });
  return res;
});

export default app;
