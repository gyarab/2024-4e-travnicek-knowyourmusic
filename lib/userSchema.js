import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const userFavoriteArtists = sqliteTable("user_favorite_artists", {
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  artistId: integer("artist_id").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});
