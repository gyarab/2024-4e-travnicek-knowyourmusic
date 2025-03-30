// app/api/favorites/check/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { userFavoriteArtists } from "@/lib/userSchema";
import { eq, and } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
	try {
		// Get the artistId from query parameters
		const { searchParams } = new URL(request.url);
		const artistId = searchParams.get("artistId");

		if (!artistId) {
			return NextResponse.json(
				{ error: "Artist ID is required" },
				{ status: 400 },
			);
		}

		// Verify user is authenticated
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json(
				{ error: "You must be logged in to check user's favorite artists." },
				{ status: 401 },
			);
		}

		// Check if the artist is in favorites
		const favorites = await db
			.select()
			.from(userFavoriteArtists)
			.where(
				and(
					eq(userFavoriteArtists.userId, session.user.id),
					eq(userFavoriteArtists.artistId, artistId),
				),
			);

		return NextResponse.json({
			isFavorite: favorites.length > 0,
		});
	} catch (error) {
		console.error("Error checking favorite:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
