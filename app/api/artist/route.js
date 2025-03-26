import { fetchArtistData } from "@/lib/spotify";

export async function GET(req) {
	const { searchParams } = new URL(req.url);
	const artistID = searchParams.get("artistID");

	if (!artistID) {
		return new Response(JSON.stringify({ error: "Missing artistID" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}

	try {
		const artist = await fetchArtistData(artistID);
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
