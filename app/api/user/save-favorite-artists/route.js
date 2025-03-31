import { saveUserFavoriteArtists } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(request) {
	// Verify authentication
	const session = await getServerSession(authOptions);

	if (!session || !session.user) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	try {
		const data = await request.json();
		const { artistIds } = data;

		// Validate input
		if (!artistIds || !Array.isArray(artistIds) || artistIds.length === 0) {
			return NextResponse.json(
				{ message: "At least one artist must be selected" },
				{ status: 400 },
			);
		}

		if (artistIds.length > 3) {
			return NextResponse.json(
				{ message: "Maximum 3 artists can be selected" },
				{ status: 400 },
			);
		}

		// Save to database
		await saveUserFavoriteArtists(session.user.id, artistIds);

		return NextResponse.json({
			message: "Favorite artists saved successfully",
		});
	} catch (error) {
		console.error("Error saving favorite artists:", error);
		return NextResponse.json(
			{ message: "Failed to save favorite artists" },
			{ status: 500 },
		);
	}
}
