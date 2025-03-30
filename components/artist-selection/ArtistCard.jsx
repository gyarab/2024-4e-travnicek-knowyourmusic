"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, CheckCircle, XCircle, Music } from "lucide-react";

export default function ArtistCard({ 
  artist, 
  isSelected, 
  onSelect, 
  onRemove,
  showDetails = false 
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Get artist image or use placeholder
  const imageUrl = artist.images && artist.images.length > 0 
    ? artist.images[0].url 
    : "/placeholder-artist.jpg";

  // Handle selection toggle
  const handleToggle = () => {
    if (isSelected) {
      onRemove();
    } else {
      onSelect();
    }
  };

  // Toggle details view
  const toggleDetails = () => {
    setDetailsOpen(!detailsOpen);
  };

  return (
    <Card className={`overflow-hidden transition-all ${isSelected ? "ring-2 ring-primary" : ""}`}>
      <div className="relative">
        <div className="aspect-square relative">
          <Image 
            src={imageUrl} 
            alt={artist.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        
        {isSelected && (
          <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
            <CheckCircle className="h-5 w-5 text-white" />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-medium truncate" title={artist.name}>
          {artist.name}
        </h3>
        
        {artist.genres && artist.genres.length > 0 && (
          <p className="text-sm text-muted-foreground truncate">
            {artist.genres.slice(0, 2).join(", ")}
          </p>
        )}
        
        <div className="mt-3 flex gap-2">
          {isSelected ? (
            <Button variant="outline" size="sm" onClick={onRemove} className="w-full">
              <XCircle className="h-4 w-4 mr-1" /> Remove
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={onSelect} className="w-full">
              <PlusCircle className="h-4 w-4 mr-1" /> Select
            </Button>
          )}
          
          {showDetails && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleDetails}
              className="w-1/3"
            >
              <Music className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Details section (expandable) */}
      {detailsOpen && showDetails && artist.topTracks && (
        <div className="p-4 border-t">
          <h4 className="text-sm font-medium mb-2">Top Tracks</h4>
          <ul className="space-y-2">
            {artist.topTracks.slice(0, 3).map(track => (
              <li key={track.id} className="text-sm">
                {track.name}
                {track.previewUrl && (
                  <audio 
                    controls 
                    className="w-full h-8 mt-1"
                    src={track.previewUrl}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}