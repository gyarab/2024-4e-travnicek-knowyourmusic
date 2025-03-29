import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { userFavoriteArtists } from "@/lib/userSchema";
import { and, eq } from "drizzle-orm";

export async function DELETE(request) {
	try {
		// Verify user is authenticated
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json(
				{ error: "You must be logged in to remove a favorite artist" },
				{ status: 401 },
			);
		}

		// Get the artistId from the request body
		const { artistId } = await request.json();

		if (!artistId) {
			return NextResponse.json(
				{ error: "Artist ID is required" },
				{ status: 400 },
			);
		}

		console.log(`Removing artist ID ${artistId} for user ${session.user.id}`);

		// Delete the favorite artist record
		const result = await db
			.delete(userFavoriteArtists)
			.where(
				and(
					eq(userFavoriteArtists.userId, session.user.id),
					eq(userFavoriteArtists.artistId, artistId),
				),
			);

		return NextResponse.json({
			success: true,
			message: `Removed artist ${artistId} from favorites`,
		});
	} catch (error) {
		console.error("Error removing favorite artist:", error);
		return NextResponse.json(
			{ error: "Failed to remove favorite artist: " + error.message },
			{ status: 500 },
		);
	}
}
