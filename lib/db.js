import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { users, userFavoriteArtists } from "./userSchema.js";
import { eq } from "drizzle-orm";

if (!process.env.DB_FILE_NAME) {
  throw new Error("Missing DB_FILE_NAME in environment variables");
}

// Initialize the database client
const client = createClient({
  url: process.env.DB_FILE_NAME,
});

export const db = drizzle(client, { schema: { users } });

export async function fetchUserFavoriteArtists(userId) {
  return await db
    .select({
      userId: userFavoriteArtists.userId,
      artistId: userFavoriteArtists.artistId,
      createdAt: userFavoriteArtists.createdAt,
    })
    .from(userFavoriteArtists)
    .where(eq(userFavoriteArtists.userId, userId));
}
