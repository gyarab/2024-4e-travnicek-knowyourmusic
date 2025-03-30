"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/hooks/use-toast";
import ArtistCard from "./ArtistCard";
import SearchResults from "./SearchResults";

export default function ArtistSelectionClient({
  userId,
  initialPopularArtists = [],
}) {
  const { toast } = useToast();
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
      toast({
        title: "Selection Limit Reached",
        description: `You can only select up to ${MAX_SELECTIONS} artists.`,
        variant: "destructive",
      });
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
      const response = await fetch(
        `/api/search-artists?q=${searchQuery}`
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setSearchResults(data || []);
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Unable to search for artists. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Handle submit
  const handleSubmit = async () => {
    if (selectedArtists.length === 0) {
      toast({
        title: "No Artists Selected",
        description: "Please select at least one artist.",
        variant: "destructive",
      });
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

      toast({
        title: "Success!",
        description: "Your favorite artists have been saved.",
      });

      // Redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast({
        title: "Save Failed",
        description:
          error.message || "Unable to save your selections. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Selection Progress</span>
          <span>
            {selectedArtists.length}/{MAX_SELECTIONS} artists
          </span>
        </div>
        <Progress value={completionPercentage} className="h-2" />
      </div>

      {/* Selected artists section */}
      {selectedArtists.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Your Selected Artists</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {selectedArtists.map((artist) => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                isSelected={true}
                onRemove={() => handleRemoveArtist(artist.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Search section */}
      <div className="space-y-4 mt-4">
        <h3 className="text-lg font-semibold">Search for Artists</h3>
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

        {searchQuery && (
          <SearchResults
            results={searchResults}
            selectedArtistIds={selectedArtists.map((a) => a.id)}
            onSelect={handleSelectArtist}
            isLoading={isSearching}
          />
        )}
      </div>

      {/* Popular artists section */}
      <div className="space-y-4 mt-4">
        <h3 className="text-lg font-semibold">Popular Artists</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {popularArtists.map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              isSelected={selectedArtists.some((a) => a.id === artist.id)}
              onSelect={() => handleSelectArtist(artist)}
              onRemove={() => handleRemoveArtist(artist.id)}
            />
          ))}
        </div>
      </div>

      {/* Submit button */}
      <div className="pt-4 flex justify-center">
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={selectedArtists.length === 0 || isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Selections & Continue"}
        </Button>
      </div>
    </div>
  );
}
