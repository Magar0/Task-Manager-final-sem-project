import { drizzle } from "drizzle-orm/node-postgres";
// import { users } from "./schema";
import { config } from "dotenv";
config({ path: ".env" });

// const connectionString = process.env.DATABASE_URL;

export const db = drizzle({
  connection: {
    connectionString: process.env.DATABASE_URL!,
    ssl: false,
  },
});
