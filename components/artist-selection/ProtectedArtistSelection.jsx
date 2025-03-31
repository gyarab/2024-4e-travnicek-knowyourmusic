"use client"

import LogoutButton from "@/components/LogoutButton";
import ArtistSelectionClient from "@/components/artist-selection/ArtistSelectionClient";
import SurveyLayout from "@/components/layouts/SurveyLayout";
import withSurveyProtection from "@/components/survey/SurveyProtection";

function ArtistSelectionComponent({ userId, initialPopularArtists }) {
  return (
    <SurveyLayout>
      <div className="relative min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="absolute top-4 right-6">
          <LogoutButton />
        </div>

        <div className="max-w-6xl mx-auto pt-8">
          <div className="border rounded-lg">
            <div className="p-6 text-center">
              <h2 className="text-2xl md:text-3xl font-semibold">
                Select Your Favorite Artists
              </h2>
              <p className="text-gray-500 mt-1">
                Choose up to 3 artists to personalize your music experience
              </p>
            </div>
            <div className="p-6">
              <ArtistSelectionClient
                userId={userId}
                initialPopularArtists={initialPopularArtists}
              />
            </div>
          </div>
        </div>
      </div>
    </SurveyLayout>
  );
}

export default withSurveyProtection(ArtistSelectionComponent);