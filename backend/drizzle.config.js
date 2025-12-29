import { drizzle } from "drizzle-orm/postgres-js";
import dotEnv from "dotenv";

dotEnv.config({ path: ".env" });

export default drizzle.defineConfig({
  out: "./src/db/migrations",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
