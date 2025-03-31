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

export const db = drizzle(client, { schema: { users, userFavoriteArtists } });

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

export async function saveUserFavoriteArtists(userId, artistIds) {
  try {
    // First delete existing favorites to avoid duplicates
    await db
      .delete(userFavoriteArtists)
      .where(eq(userFavoriteArtists.userId, userId));
    
    // Then insert the new favorites
    const insertPromises = artistIds.map(artistId => 
      db.insert(userFavoriteArtists)
        .values({ userId, artistId })
    );
    
    return Promise.all(insertPromises);
  } catch (error) {
    console.error("Error saving user favorite artists:", error);
    throw error;
  }
}
