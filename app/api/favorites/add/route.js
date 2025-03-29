import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { userFavoriteArtists } from "@/lib/userSchema";
import { and, eq } from "drizzle-orm";

export async function POST(request) {
  try {
    // Verify user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "You must be logged in to add a favorite artist" },
        { status: 401 }
      );
    }

    // Get the artistId from the request body
    const { artistId } = await request.json();

    if (!artistId) {
      return NextResponse.json(
        { error: "Artist ID is required" },
        { status: 400 }
      );
    }

    console.log(
      `Adding artist ID ${artistId} as favorite for user ${session.user.id}`
    );

    // Check if already favorited
    const existingFavorite = await db
      .select()
      .from(userFavoriteArtists)
      .where(
        and(
          eq(userFavoriteArtists.userId, session.user.id),
          eq(userFavoriteArtists.artistId, artistId)
        )
      );

    // If not already favorited, add to favorites
    if (existingFavorite.length === 0) {
      await db.insert(userFavoriteArtists).values({
        userId: session.user.id,
        artistId: artistId,
      });
    }
    return NextResponse.json({
      success: true,
      message: `Succesfully added artist ${artistId} as favorite for user ${session.user.id}`,
    });
  } catch (error) {
    console.error("Error adding favorite:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
