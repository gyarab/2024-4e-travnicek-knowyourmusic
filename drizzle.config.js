import { defineConfig } from "drizzle-kit";
import "dotenv/config"; // Load environment variables

export default defineConfig({
  dialect: "sqlite",
  schema: "./lib/userSchema.js", // Ensure the schema file exists here
  out: "./drizzle", // Folder where migrations are saved
  dbCredentials: {
    url: process.env.DB_FILE_NAME ?? "file:./mydatabase.sqlite", // Ensure "file:" prefix
  },
});
