"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Info } from "lucide-react";
import ArtistCard from "./ArtistCard";

export default function ArtistSelectionClient({
  userId,
  initialPopularArtists = [],
}) {
  const router = useRouter();
  const [popularArtists] = useState(initialPopularArtists);
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MAX_SELECTIONS = 3;
  const completionPercentage = (selectedArtists.length / MAX_SELECTIONS) * 100;

  // Handle artist selection
  const handleSelectArtist = (artist) => {
    if (selectedArtists.length >= MAX_SELECTIONS) {
      alert(
        `Selection Limit Reached: You can only select up to ${MAX_SELECTIONS} artists.`
      );
      return;
    }

    if (!selectedArtists.some((a) => a.id === artist.id)) {
      setSelectedArtists([...selectedArtists, artist]);
    }
  };

  // Handle artist removal
  const handleRemoveArtist = (artistId) => {
    setSelectedArtists(
      selectedArtists.filter((artist) => artist.id !== artistId)
    );
  };

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const response = await fetch(`/api/search-artists?q=${searchQuery}`);

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setSearchResults(data || []);
    } catch (error) {
      alert("Search Failed: Unable to search for artists. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  // Handle submit
  const handleSubmit = async () => {
    if (selectedArtists.length === 0) {
      alert("No Artists Selected: Please select at least one artist.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/user/save-favorite-artists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          artistIds: selectedArtists.map((artist) => artist.id),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save selections");
      }

      alert("Success! Your favorite artists have been saved.");

      // Redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      alert(
        `Save Failed: ${
          error.message || "Unable to save your selections. Please try again."
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter out selected artists from search results
  const filteredSearchResults = searchResults.filter(
    (artist) => !selectedArtists.some((selected) => selected.id === artist.id)
  );

  // Filter out selected artists from popular artists
  const filteredPopularArtists = popularArtists.filter(
    (artist) => !selectedArtists.some((selected) => selected.id === artist.id)
  );

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Selection Progress</span>
          <span className="font-medium">
            {selectedArtists.length}/{MAX_SELECTIONS} artists
          </span>
        </div>
        <Progress value={completionPercentage} className="h-2" />
      </div>

      {/* Selected artists section */}
      {selectedArtists.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Info className="h-5 w-5" /> Your Selected Artists
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {selectedArtists.map((artist) => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                isSelected={true}
                onRemove={() => handleRemoveArtist(artist.id)}
                onSelect={() => {}}
              />
            ))}
          </div>
        </div>
      )}

      {/* Search section */}
      <div className="space-y-3">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Search className="h-5 w-5" /> Search for Artists
        </h3>
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Search by artist name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isSearching}>
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </form>

        {/* Search results */}
        {searchQuery && (
          <div className="mt-4">
            {isSearching ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i}>
                    <Skeleton className="aspect-square w-full rounded-md" />
                    <div className="space-y-2 mt-2">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredSearchResults.length === 0 ? (
              <div className="text-center p-6 bg-muted/50 rounded-lg">
                {searchResults.length === 0 ? (
                  <p className="text-muted-foreground">
                    No artists found matching "{searchQuery}"
                  </p>
                ) : (
                  <p className="text-muted-foreground">
                    All found artists are already selected
                  </p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {filteredSearchResults.map((artist) => (
                  <ArtistCard
                    key={artist.id}
                    artist={artist}
                    isSelected={false}
                    onSelect={() => handleSelectArtist(artist)}
                    onRemove={() => {}}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Popular artists section */}
      {filteredPopularArtists.length > 0 && (
        <div className="space-y-3 mt-4">
          <h3 className="text-xl font-semibold">Popular Artists</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredPopularArtists.map((artist) => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                isSelected={false}
                onSelect={() => handleSelectArtist(artist)}
                onRemove={() => {}}
              />
            ))}
          </div>
        </div>
      )}

      {/* Submit button */}
      <div className="pt-4 flex justify-center mt-8">
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={selectedArtists.length === 0 || isSubmitting}
          className="px-8"
        >
          {isSubmitting ? "Saving..." : "Save Selections & Continue"}
        </Button>
      </div>
    </div>
  );
}
