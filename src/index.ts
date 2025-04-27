import { Hono } from "hono";
import { jwt, sign } from "hono/jwt";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./trpc/router";

const app = new Hono();

app.post("/login", async (c) => {
  const { username, password } = await c.req.json();

  const payload = { userId: 123, username };

  const token = await sign(payload, "your-secret-key");
  return c.json({ token });
});

app.use("*", jwt({ secret: "your-secret-key" }));

app.all("/*", async (c) => {
  const user = c.get("jwtPayload");
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
