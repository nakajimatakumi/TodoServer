import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "d1-http",
  dialect: "sqlite",
  dbCredentials: {
    accountId: process.env.DB_ACCOUNT_ID!,
    databaseId: process.env.DB_DATABASE_ID!,
    token: process.env.DB_TOKEN!,
  },
});
