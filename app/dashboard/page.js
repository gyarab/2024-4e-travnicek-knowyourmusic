import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import LogoutButton from "@/components/LogoutButton";
import {
	fetchArtistData,
	fetchRandomArtistsByMainArtistGenres,
	fetchUserFavoriteArtistsData,
} from "@/lib/spotify";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Dashboard() {
	const session = await getServerSession(authOptions);
	if (!session) {
		redirect("/login");
	}

	const artistId = "1kmpkcYbuaZ8tnFejLzkj2"; // Example: Calvin Harris
	const artist = await fetchArtistData(artistId);

	const recommendedArtists =
		await fetchRandomArtistsByMainArtistGenres(artistId);

	const favoriteArtists = await fetchUserFavoriteArtistsData(session.user.id); // Fetch user's favorite artists

	return (
		<div className="relative flex min-h-screen bg-gray-100 p-6">
			<div className="absolute top-4 right-6">
				<LogoutButton />
			</div>

			<div className="w-1/3 p-4">
				<Card>
					<CardHeader>
						<CardTitle>Welcome, {session.user.name}!</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-gray-600">Your favorite artists:</p>

						{favoriteArtists.length > 0 ? (
							favoriteArtists.map((artist, index) => (
								<div
									key={`${artist.id}-${index}`}
									className="flex items-center p-4 mt-4 shadow-md rounded-lg gap-4"
								>
									<div className="w-1/3">
										<img
											src={artist.image}
											alt={artist.name}
											className="w-full h-auto rounded-md"
										/>
									</div>
									<div className="w-2/3 flex flex-col justify-center items-center text-center">
										<h3 className="text-2xl font-semibold text-gray-600">
											{artist.name}
										</h3>
										<Button variant="outline" className="w-full mt-2" asChild>
											<a href={artist.spotifyUrl} target="_blank">
												View on Spotify
											</a>
										</Button>
										<Button variant="destructive" className="w-full mt-2">
											Remove
										</Button>
									</div>
								</div>
							))
						) : (
							<p>No favorite artists found.</p>
						)}
					</CardContent>
				</Card>
			</div>

			<div className="w-2/3 p-4">
				<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
					Recommended Artists (Based on Genres)
				</h3>
				<p className="text-sm text-gray-500">
					If no genres are found for the artist, a random genre is selected from
					the top 3 (pop, edm, techno).
				</p>

				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
					{recommendedArtists.map((artist) => (
						<Card key={artist.id} className="flex items-center p-4">
							<img src={artist.image} alt={artist.name} className="w-24 h-24" />
							<div className="ml-4">
								<CardTitle>
									<Link
										href={`/artist-detail?artistID=${artist.id}`}
										className="hover:underline"
									>
										{artist.name}
									</Link>
								</CardTitle>
								<CardDescription className="text-gray-500">
									Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
									do eiusmod tempor incididunt ut labore et dolore magna aliqua.
								</CardDescription>
								<Button variant="outline" className="w-full mt-2" asChild>
									<a href={artist.spotifyUrl} target="_blank">
										View on Spotify
									</a>
								</Button>
							</div>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
