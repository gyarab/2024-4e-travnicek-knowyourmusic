// app/api/search-artists/route.js
import { searchArtists } from "@/lib/spotify";
import { NextResponse } from "next/server";

export async function GET(request) {
	// Extract search query from URL parameters
	const { searchParams } = new URL(request.url);
	const query = searchParams.get("q");

	// Return error if query is missing
	if (!query) {
		return NextResponse.json(
			{ error: "Search query is required" },
			{ status: 400 },
		);
	}

	try {
		// Get artists from the Spotify API using our utility function
		const artists = await searchArtists(query, 5);

		// Return the results as JSON
		return NextResponse.json(artists);
	} catch (error) {
		console.error("Error searching artists:", error);

		// Return appropriate error response
		return NextResponse.json(
			{ error: error.message || "Failed to search artists" },
			{ status: 500 },
		);
	}
}
