import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LogoutButton from "@/components/LogoutButton";
import {
  fetchArtistData,
  fetchRandomArtistsByArtistGenres,
  fetchUserFavoriteArtistsData,
} from "@/lib/spotify";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import RemoveFavoriteButton from "@/components/dashboard/RemoveFavoriteButton";

// Helper function to extract Spotify artist ID from URL
function extractArtistIdFromUrl(spotifyUrl) {
  if (!spotifyUrl) return null;

  try {
    // Extract the ID from the end of the URL
    const urlParts = spotifyUrl.split("/");
    return urlParts[urlParts.length - 1];
  } catch (error) {
    console.error("Error extracting artist ID from URL:", error);
    return null;
  }
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const favoriteArtists = await fetchUserFavoriteArtistsData(session.user.id);

  const favArtistIdSet = new Set();
  favoriteArtists.map((artist, index) => {
    const artistIdForRemoval = extractArtistIdFromUrl(artist.spotifyUrl);
    favArtistIdSet.add(artistIdForRemoval);
  });

  const recommendedArtists = await fetchRandomArtistsByArtistGenres([
    ...favArtistIdSet,
  ]);

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
              favoriteArtists.map((artist, index) => {
                // Extract artist ID from the Spotify URL
                const artistIdForRemoval = extractArtistIdFromUrl(
                  artist.spotifyUrl
                );

                return (
                  <div
                    key={`${artistIdForRemoval || "unknown"}-${index}`}
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
                      {artistIdForRemoval ? (
                        <RemoveFavoriteButton artistId={artistIdForRemoval} />
                      ) : (
                        <Button
                          variant="destructive"
                          className="w-full mt-2"
                          disabled
                        >
                          Cannot Remove
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })
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
            <Card key={artist.id} className="flex p-4">
              <div className="w-1/5 h-full">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              <div className="ml-4 flex-1 space-y-4">
                <CardTitle>
                  <Link
                    href={`/artist-detail?artistID=${artist.id}`}
                    className="hover:underline text-2xl text-center"
                  >
                    {artist.name}
                  </Link>
                </CardTitle>

                <Button variant="outline" className="w-full" asChild>
                  <Link href={artist.spotifyUrl} target="_blank">
                    View on Spotify
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
