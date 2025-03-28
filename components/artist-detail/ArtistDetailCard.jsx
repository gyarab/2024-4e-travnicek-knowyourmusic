"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ArtistDetailCard() {
  const searchParams = useSearchParams();
  const artistID = searchParams.get("artistID");
  const [artist, setArtist] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (artistID) {
      fetch(`/api/artist?artistID=${artistID}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) throw new Error(data.error);
          setArtist(data);
        })
        .catch((err) => setError(err.message));

      fetch(`/api/top-tracks?artistID=${artistID}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) throw new Error(data.error);
          setTopTracks(data);
        })
        .catch((err) => setError(err.message));
    }
  }, [artistID]);

  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!artist)
    return <p className="text-gray-500">Loading artist details...</p>;

  return (
    <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
      {/* Artist Info Card */}
      <section className="flex flex-col gap-2 max-w-sm">
        <div className="max-w-sm shadow-lg p-4">
          {artist.image ? (
            <img
              src={artist.image}
              alt={artist.name}
              className="w-full h-auto rounded-md"
            />
          ) : (
            <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500">
              No Image Available
            </div>
          )}
          <h2 className="text-xl font-semibold mt-2">
            <a
              href={artist.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {artist.name}
            </a>
          </h2>
          <p>
            <strong>Genres:</strong> {artist.genres?.join(", ") || "N/A"}
          </p>
          <p>
            <strong>Popularity:</strong> {artist.popularity}%
          </p>
          <p>
            <strong>Followers:</strong> {artist.followers?.toLocaleString()}
          </p>
          <a
            href={artist.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-4 text-center text-white bg-green-600 hover:bg-green-700 py-2 px-4 rounded-md"
          >
            View on Spotify
          </a>
        </div>
        <div className="mt-4">
          <Link href="/dashboard">
            <Button variant="outline" className="w-full">← Back to Dashboard</Button>
          </Link>
        </div>
      </section>

      {/* Top Tracks Container (Right-aligned) */}
      <div className="max-w-sm min-w-64 shadow-lg p-4 md:ml-4">
        <h3 className="text-lg font-semibold">Top Tracks</h3>
        {topTracks.length > 0 ? (
          <div className="mt-2 grid gap-2">
            {topTracks.map((track) => (
              <div
                key={track.id}
                className="flex gap-2 p-2 border rounded-md shadow-sm bg-gray-50 hover:bg-gray-100 transition"
              >
                <img
                  src={track.album.image}
                  alt={track.album.image}
                  className="w-16 h-16 rounded-md"
                />
                <div>
                  <p className="font-medium">
                    <a
                      href={track.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {track.name}
                    </a>
                  </p>
                  <p className="text-gray-600 text-sm">
                    {track.album.name ? track.album.name : "Unknown Album"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No top tracks available.</p>
        )}
      </div>
    </div>
  );
}
