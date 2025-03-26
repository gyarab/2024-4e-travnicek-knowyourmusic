import "dotenv/config";
import { fetchUserFavoriteArtists } from "@/lib/db";

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

export async function fetchUserFavoriteArtistsData(userId) {
  const favoriteArtists = await fetchUserFavoriteArtists(userId);

  if (!favoriteArtists.length) {
    return [];
  }

  // Fetch detailed artist data from Spotify API
  const artistDataPromises = favoriteArtists.map((artist) =>
    fetchArtistData(artist.artistId)
  );

  // Resolve all promises
  const artistsData = await Promise.all(artistDataPromises);
  return artistsData;
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

export async function fetchRandomArtistsByMainArtistGenres(mainArtistId) {
  try {
    // Fetch genres of the main artist
    let genres = await fetchArtistGenres(mainArtistId);

    if (genres.length === 0) {
      genres = ["pop", "edm", "techno"];
    }

    // Select a random genre
    const randomGenre = genres[Math.floor(Math.random() * genres.length)];

    // Fetch artists by the selected genre
    const artists = await fetchArtistsByGenre(randomGenre);

    return artists;
  } catch (error) {
    console.error("Error in fetchRandomArtistsByMainArtistGenres:", error);
    throw error;
  }
}

async function fetchArtistGenres(artistId) {
  const accessToken = await getSpotifyAccessToken();
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
  return data.genres;
}

async function fetchArtistsByGenre(genre, limit = 12) {
  const accessToken = await getSpotifyAccessToken();
  const url = `${SPOTIFY_SEARCH_API_BASE_URL}?q=genre:"${encodeURIComponent(
    genre
  )}"&type=artist&limit=${limit}`;

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
      `❌ Failed to fetch artists by genre. Status: ${response.status} - ${errorText}`
    );
  }

  const data = await response.json();
  return data.artists.items.map((artist) => ({
    id: artist.id,
    name: artist.name,
    image: artist.images?.[0]?.url || null,
    spotifyUrl: artist.external_urls.spotify,
  }));
}

export async function fetchArtistTopTracks(artistId, market = "CZ") {
  const accessToken = await getSpotifyAccessToken();
  const url = `${SPOTIFY_API_BASE_URL}/${artistId}/top-tracks?market=${market}`;

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
  return data.tracks.map((track) => ({
    id: track.id,
    name: track.name,
    previewUrl: track.preview_url,
    album: {
      name: track.album.name,
      image: track.album.images?.[0]?.url || null,
    },
    spotifyUrl: track.external_urls.spotify,
  }));
}
