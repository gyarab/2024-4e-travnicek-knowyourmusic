import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { fetchRandomArtistsByArtistGenres } from "@/lib/spotify";
import ProtectedArtistSelection from "@/components/artist-selection/ProtectedArtistSelection";

export default async function ArtistSelection() {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect("/login");
	}

	if (session.user.hasCompletedSurvey) {
		redirect("/dashboard");
	}

	// Fetch initial popular artists (this happens on the server)
	const popularArtists = await fetchRandomArtistsByArtistGenres([]);

	return (
		<ProtectedArtistSelection
			userId={session.user.id}
			initialPopularArtists={popularArtists}
		/>
	);
}
