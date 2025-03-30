"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search, Music, Disc, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
	Command,
	CommandInput,
	CommandList,
	CommandItem,
} from "@/components/ui/command";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function SearchArtist() {
	const [searchQuery, setSearchQuery] = useState("");
	const [artists, setArtists] = useState([]);
	const [loading, setLoading] = useState(false);
	const [selectedArtist, setSelectedArtist] = useState(null);
	const [topTracks, setTopTracks] = useState([]);
	const [artistLoading, setArtistLoading] = useState(false);
	const [favoriteLoading, setFavoriteLoading] = useState(false);
	const [isFavorite, setIsFavorite] = useState(false);

	// Custom debounce hook implementation
	const useDebounce = (callback, delay) => {
		const timeoutRef = useRef(null);

		return useCallback(
			(...args) => {
				// Clear previous timeout if it exists
				if (timeoutRef.current) {
					clearTimeout(timeoutRef.current);
				}

				// Set new timeout
				timeoutRef.current = setTimeout(() => {
					callback(...args);
				}, delay);
			},
			[callback, delay],
		);
	};

	// Search function
	const searchArtists = async (query) => {
		if (!query) {
			setArtists([]);
			return;
		}

		try {
			setLoading(true);
			const response = await fetch(
				`/api/search-artists?q=${encodeURIComponent(query)}`,
			);

			if (!response.ok) {
				throw new Error(`Search failed: ${response.status}`);
			}

			const data = await response.json();
			setArtists(data);
		} catch (error) {
			console.error("Error searching artists:", error);
			// You could add error handling UI here
		} finally {
			setLoading(false);
		}
	};

	// Create debounced version of search function
	const debouncedSearch = useDebounce(searchArtists, 500);

	// Fetch artist details and top tracks
	const fetchArtistDetails = async (artistId) => {
		try {
			setArtistLoading(true);
			const response = await fetch(`/api/top-tracks?artistId=${artistId}`);

			if (!response.ok) {
				throw new Error(`Failed to fetch artist: ${response.status}`);
			}

			const ttRes = await response.json();
			setTopTracks(ttRes);

			// Check if this artist is in favorites
			const favoriteResponse = await fetch(
				`/api/favorites/check?artistId=${artistId}`,
			);
			if (favoriteResponse.ok) {
				const { isFavorite } = await favoriteResponse.json();
				setIsFavorite(isFavorite);
			}
		} catch (error) {
			console.error("Error fetching artist details:", error);
		} finally {
			setArtistLoading(false);
		}
	};

	// Add artist to favorites
	const addToFavorites = async () => {
		if (!selectedArtist) return;

		try {
			setFavoriteLoading(true);
			const response = await fetch("/api/favorites/add", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ artistId: selectedArtist.id }),
			});

			if (!response.ok) {
				throw new Error("Failed to add artist to favorites");
			}

			setIsFavorite(true);
			alert(`${selectedArtist.name} has been added to your favorites`);
		} catch (error) {
			console.error("Error adding to favorites:", error);
			error("Failed to add artist to favorites. Please try again.");
		} finally {
			setFavoriteLoading(false);
		}
	};

	const removeFromFavorites = async () => {
		if (!selectedArtist) return;

		try {
			setFavoriteLoading(true);
			const response = await fetch("/api/favorites/remove", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ artistId: selectedArtist.id }),
			});

			if (!response.ok) {
				throw new Error("Failed to remove artist from favorites");
			}

			setIsFavorite(false);
			alert(`${selectedArtist.name} has been removed to your favorites`);
		} catch (error) {
			console.error("Error removing from favorites:", error);
			error("Failed to add artist to favorites. Please try again.");
		} finally {
			setFavoriteLoading(false);
		}
	};

	// Handle input change
	const handleSearchChange = (e) => {
		const query = e.target.value;
		setSearchQuery(query);
		debouncedSearch(query);
	};

	// Handle artist selection
	const handleSelectArtist = (artist) => {
		setSelectedArtist(artist);
		fetchArtistDetails(artist.id);
		setSearchQuery(""); // Clear search after selection
		setArtists([]); // Clear suggestions
	};

	// Format milliseconds to minutes:seconds
	const formatDuration = (ms) => {
		const minutes = Math.floor(ms / 60000);
		const seconds = ((ms % 60000) / 1000).toFixed(0);
		return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
	};

	return (
		<div className="container mx-auto py-8 px-4">
			<h1 className="text-3xl font-bold mb-6 text-center">
				Search for Artists
			</h1>

			<div className="max-w-xl mx-auto mb-8">
				<div className="relative">
					<Input
						type="text"
						placeholder="Search for an artist..."
						value={searchQuery}
						onChange={handleSearchChange}
						className="w-full"
					/>
					<div className="absolute right-3 top-3">
						{loading ? (
							<div className="h-4 w-4 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
						) : (
							<Search className="h-4 w-4 text-muted-foreground" />
						)}
					</div>
				</div>

				{/* Artist Suggestions */}
				{searchQuery.length > 0 && (
					<div className="relative mt-1 z-10">
						<Card className="absolute w-full">
							<Command>
								<CommandList>
									{loading ? (
										<div className="p-4 text-center">
											<div className="h-5 w-5 animate-spin rounded-full border-2 border-foreground border-t-transparent mx-auto" />
										</div>
									) : artists.length > 0 ? (
										artists.map((artist) => (
											<CommandItem
												key={artist.id}
												onSelect={() => handleSelectArtist(artist)}
												value={artist.id} // Adding this might help with internal tracking
												className="flex items-center gap-3 p-2 cursor-pointer"
											>
												<Avatar className="h-8 w-8">
													{artist.images && artist.images.length > 0 ? (
														<AvatarImage
															src={artist.images[0].url}
															alt={artist.name}
														/>
													) : (
														<AvatarFallback>
															<Music className="h-4 w-4" />
														</AvatarFallback>
													)}
												</Avatar>
												<div>
													<p className="font-medium">{artist.name}</p>
													<p className="text-xs text-muted-foreground">
														{artist.followers
															? `${artist.followers.total.toLocaleString()} followers`
															: ""}
													</p>
												</div>
											</CommandItem>
										))
									) : (
										<CommandItem
											disabled
											className="p-2 text-center text-sm text-muted-foreground"
										>
											No artists found
										</CommandItem>
									)}
								</CommandList>
							</Command>
						</Card>
					</div>
				)}
			</div>

			{/* Artist Details */}
			{selectedArtist && (
				<div className="max-w-4xl mx-auto">
					<Card className="mb-6">
						<CardHeader className="flex flex-row gap-4 items-center">
							<Avatar className="h-24 w-24">
								{selectedArtist.images && selectedArtist.images.length > 0 ? (
									<AvatarImage
										src={selectedArtist.images[0].url}
										alt={selectedArtist.name}
									/>
								) : (
									<AvatarFallback className="text-3xl">
										<Music className="h-12 w-12" />
									</AvatarFallback>
								)}
							</Avatar>
							<div className="flex-grow">
								<CardTitle className="text-3xl">
									{selectedArtist.name}
								</CardTitle>
								<div className="flex items-center mt-2 text-sm text-muted-foreground">
									<span className="mr-4">
										{selectedArtist.followers?.total.toLocaleString()} followers
									</span>
									{selectedArtist.genres &&
										selectedArtist.genres.length > 0 && (
											<span>
												Genres: {selectedArtist.genres.slice(0, 3).join(", ")}
											</span>
										)}
								</div>
							</div>
							<div className="flex gap-2">
								<Button
									variant="outline"
									className="flex items-center gap-2"
									asChild
								>
									<a
										href={selectedArtist.external_urls?.spotify}
										target="_blank"
										rel="noopener noreferrer"
									>
										View on Spotify
									</a>
								</Button>

								<Button
									variant={isFavorite ? "secondary" : "default"}
									className="flex items-center gap-2"
									onClick={isFavorite ? removeFromFavorites : addToFavorites}
									disabled={favoriteLoading}
								>
									{favoriteLoading ? (
										<div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
									) : (
										<Heart
											className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
										/>
									)}
									{isFavorite ? "Remove Favorite" : "Add Favorite"}
								</Button>
							</div>
						</CardHeader>
					</Card>

					{/* Top Tracks Section */}
					<div className="mt-8">
						<h2 className="text-2xl font-bold mb-6">Top Tracks</h2>

						{artistLoading ? (
							<div className="flex justify-center py-12">
								<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
							</div>
						) : topTracks.length > 0 ? (
							<div className="grid gap-4">
								{topTracks.map((track, index) => (
									<Card
										key={track.id}
										className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
									>
										<div className="flex items-center p-4">
											{/* Track number */}
											<div className="flex-shrink-0 mr-4 w-8 text-center">
												<span className="text-xl font-bold text-muted-foreground">
													{index + 1}
												</span>
											</div>

											{/* Album artwork */}
											<div className="flex-shrink-0 mr-4">
												{track.album.image ? (
													<img
														src={track.album.image}
														className="h-16 w-16 object-cover rounded-md shadow-sm"
													/>
												) : (
													<div className="h-16 w-16 bg-muted rounded-md flex items-center justify-center">
														<Disc className="h-8 w-8 text-muted-foreground" />
													</div>
												)}
											</div>

											{/* Track info */}
											<div className="flex-grow">
												<h3 className="font-semibold text-base truncate">
													{track.name}
												</h3>
												<p className="text-sm text-muted-foreground truncate">
													{track.album.name}
												</p>
											</div>

											{/* Spotify link button */}
											<div className="ml-4">
												<Button
													variant="outline"
													className="w-full mt-2"
													asChild
												>
													<a href={track.spotifyUrl} target="_blank">
														View on Spotify
													</a>
												</Button>
											</div>
										</div>
									</Card>
								))}
							</div>
						) : (
							<Card className="p-6 text-center">
								<p className="text-muted-foreground">
									No tracks found for this artist
								</p>
							</Card>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
