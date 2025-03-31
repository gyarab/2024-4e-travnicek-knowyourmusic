"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RemoveFavoriteButton({ artistId }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Debug log to see what's being received
  useEffect(() => {
    console.log("RemoveFavoriteButton received artistId:", artistId);
  }, [artistId]);

  const handleRemove = async () => {
    if (!artistId) {
      alert("Cannot remove: missing artist ID");
      return;
    }

    if (
      confirm("Are you sure you want to remove this artist from favorites?")
    ) {
      try {
        setIsLoading(true);
        console.log("Sending DELETE request with artistId:", artistId);

        const response = await fetch("/api/favorites/remove", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ artistId }),
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.error || "Failed to remove artist");
        }

        // Refresh the page to update the favorites list
        router.refresh();
      } catch (error) {
        console.error("Error removing favorite artist:", error);
        alert("Failed to remove artist from favorites: " + error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Button
      variant="destructive"
      className="w-full mt-2"
      onClick={handleRemove}
      disabled={isLoading || !artistId}
    >
      {isLoading ? "Removing..." : "Remove"}
    </Button>
  );
}
