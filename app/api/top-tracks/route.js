import { fetchArtistTopTracks } from "@/lib/spotify";

export async function GET(req) {
	const { searchParams } = new URL(req.url);
	const artistId = searchParams.get("artistId");

	if (!artistId) {
		return new Response(JSON.stringify({ error: "Missing artistId" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}

	try {
		const artist = await fetchArtistTopTracks(artistId);
		return new Response(JSON.stringify(artist), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
