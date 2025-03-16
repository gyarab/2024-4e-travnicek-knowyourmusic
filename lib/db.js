import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { users } from "./userSchema.js"; // Import users table

if (!process.env.DB_FILE_NAME) {
  throw new Error("Missing DB_FILE_NAME in environment variables");
}

// Initialize the database client
const client = createClient({
  url: process.env.DB_FILE_NAME,
});

export const db = drizzle(client, { schema: { users } });