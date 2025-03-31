import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchRandomArtistsByArtistGenres } from "@/lib/spotify";
import LogoutButton from "@/components/LogoutButton";
import ArtistSelectionClient from "@/components/artist-selection/ArtistSelectionClient";

export default async function ArtistSelectionPage() {
	// Check authentication
	const session = await getServerSession(authOptions);
	if (!session) {
		redirect("/login");
	}

	// Fetch initial popular artists
	const popularArtists = await fetchRandomArtistsByArtistGenres([]);

	return (
		<div className="relative min-h-screen bg-gray-50 p-4 md:p-6">
			<div className="absolute top-4 right-6">
				<LogoutButton />
			</div>

			<div className="max-w-6xl mx-auto pt-8">
				<div className="border rounded-lg">
					<div className="p-6 text-center">
						<h2 className="text-2xl md:text-3xl font-semibold">
							Select Your Favorite Artists
						</h2>
						<p className="text-gray-500 mt-1">
							Choose up to 3 artists to personalize your music experience
						</p>
					</div>
					<div className="p-6">
						<ArtistSelectionClient
							userId={session.user.id}
							initialPopularArtists={popularArtists}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
