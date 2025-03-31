"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, X } from "lucide-react";
import Image from "next/image";

export default function ArtistCard({ artist, isSelected, onSelect, onRemove }) {
  // Get the image URL from the artist data
  const aimg = artist?.image ? artist.image : artist?.images[0]?.url;
  const imageUrl = aimg ? aimg : "/avatar-thumbnail.jpeg";

  // Get genres as a string
  const genreText =
    artist.genres && artist.genres.length > 0
      ? artist.genres.slice(0, 2).join(", ")
      : "Artist";

  return (
    <Card
      className={`w-full overflow-hidden ${
        isSelected ? "border-2 border-primary" : ""
      }`}
    >
      <div className="relative pt-[100%] bg-muted">
        <Image src={imageUrl} alt={artist.name} fill />
      </div>

      <CardContent className="p-3">
        <h3 className="font-medium text-sm truncate" title={artist.name}>
          {artist.name}
        </h3>
        <p className="text-xs text-muted-foreground truncate">{genreText}</p>
      </CardContent>

      <CardFooter className="p-3 pt-0">
        {isSelected ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onRemove}
            className="w-full"
          >
            <X className="h-4 w-4 mr-1" /> Remove
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={onSelect}
            className="w-full"
          >
            <PlusCircle className="h-4 w-4 mr-1" /> Select
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
