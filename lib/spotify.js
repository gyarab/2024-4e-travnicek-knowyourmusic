import "dotenv/config";

const SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1/artists";
const SPOTIFY_SEARCH_API_BASE_URL = "https://api.spotify.com/v1/search";

let spotifyAccessToken = "";
let tokenExpirationTime = 0;

async function fetchSpotifyAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const tokenUrl = "https://accounts.spotify.com/api/token";

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  spotifyAccessToken = data.access_token;
  tokenExpirationTime = Date.now() + data.expires_in * 1000; // Store expiration time

  console.log("🔑 New Spotify Access Token Fetched:", spotifyAccessToken);
  return spotifyAccessToken;
}

export async function getSpotifyAccessToken() {
  if (!spotifyAccessToken || Date.now() >= tokenExpirationTime) {
    console.log("🔄 Token expired or missing. Fetching a new one...");
    return await fetchSpotifyAccessToken();
  }
  console.log("✅ Using existing Spotify Access Token");
  return spotifyAccessToken;
}

export async function fetchArtistData(artistId) {
  const accessToken = await getSpotifyAccessToken(); // Ensure we have a valid token
  const url = `${SPOTIFY_API_BASE_URL}/${artistId}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  return {
    name: data.name,
    genres: data.genres,
    image: data.images?.[0]?.url || null,
    popularity: data.popularity,
    followers: data.followers.total,
    spotifyUrl: data.external_urls.spotify,
  };
}

export async function fetchRecommendedArtists(mainArtistId) {
  try {
    const accessToken = await getSpotifyAccessToken();

    const url = `https://api.spotify.com/v1/recommendations?seed_artists=${mainArtistId}&limit=10`;

    console.log(
      `🔍 Fetching recommended tracks for artist ID: ${mainArtistId}`
    );

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `❌ Failed to fetch recommended tracks. Status: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    console.log("🎵 Recommended Tracks Fetched:", data);

    const uniqueArtists = [];
    const seenArtistIds = new Set();

    for (const track of data.tracks) {
      for (const artist of track.artists) {
        if (!seenArtistIds.has(artist.id) && uniqueArtists.length < 5) {
          seenArtistIds.add(artist.id);
          uniqueArtists.push({
            id: artist.id,
            name: artist.name,
            image: artist.images?.[0]?.url || null, 
            spotifyUrl: artist.external_urls.spotify,
          });
        }
      }
    }

    return uniqueArtists;
  } catch (error) {
    console.error("Error in fetchRecommendedArtists:", error);
    throw error;
  }
}
