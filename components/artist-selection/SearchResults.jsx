"use client";

import ArtistCard from "./ArtistCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function SearchResults({
  results = [],
  selectedArtistIds = [],
  onSelect,
  isLoading = false,
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-[200px] w-full rounded-md" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">No artists found with that name</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
      {results.map((artist) => (
        <ArtistCard
          key={artist.id}
          artist={artist}
          isSelected={selectedArtistIds.includes(artist.id)}
          onSelect={() => onSelect(artist)}
          onRemove={() => {}}
          showDetails={true}
        />
      ))}
    </div>
  );
}
