import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ArtistSelectionClient from "@/components/artist-selection/ArtistSelectionClient";
// import { getPopularArtists } from "@/lib/spotify";

export default async function ArtistSelectionPage() {
	// Check authentication
	const session = await getServerSession(authOptions);
	if (!session) {
		redirect("/login");
	}

	// Fetch initial popular artists
	//   const popularArtists = await getPopularArtists(10);

	return (
		<div className="flex min-h-screen bg-gray-100 p-6">
			<div className="w-full mx-auto max-w-5xl">
				<Card className="w-full">
					<CardHeader>
						<CardTitle className="text-center text-2xl md:text-3xl">
							Select Your Favorite Artists
						</CardTitle>
						<p className="text-center text-muted-foreground">
							Choose up to 3 artists to personalize your experience
						</p>
					</CardHeader>
					<CardContent>
						<ArtistSelectionClient
							userId={session.user.id}
							//   initialPopularArtists={popularArtists}
							initialPopularArtists={[]}
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
