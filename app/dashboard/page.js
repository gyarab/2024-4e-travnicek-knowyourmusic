import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LogoutButton from "@/components/LogoutButton";
import { fetchArtistData, fetchRecommendedArtists } from "@/lib/spotify";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const artistId = "7CajNmpbOovFoOoasH2HaY"; // Example: Calvin Harris
  const artist = await fetchArtistData(artistId);

  const recommendedArtists = [{id: 0, name: "test", spotifyUrl: ""}];

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
            <ul className="list-disc list-inside text-gray-800">
              <li>Loading...</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="w-2/3 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Recommended Artists (Based on Tracks)</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4 overflow-x-auto">
            {recommendedArtists.map((artist) => (
              <div key={artist.id} className="w-40 flex-shrink-0">
                <Card>
                  <CardContent className="p-2">
                    <p className="text-center font-semibold mt-2">
                      {artist.name}
                    </p>
                    
                    <a
                      href={artist.spotifyUrl}
                      target="_blank"
                      className="text-blue-500 text-sm text-center block mt-1 hover:underline"
                    >
                      View on Spotify
                    </a>
                  </CardContent>
                </Card>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
