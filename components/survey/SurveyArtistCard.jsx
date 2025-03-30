import { useState } from "react";
import Image from "next/image";

export default function SurveyArtistCard({
  artist,
  isSelected,
  onSelect,
  onUnselect,
  isDetailedView = false,
}) {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    if (!isDetailedView) return;
    setShowDetails(!showDetails);
  };

  const handleSelectToggle = () => {
    if (isSelected) {
      onUnselect(artist.id);
    } else {
      onSelect(artist);
    }
  };

  // Default image if artist has no images
  const imageUrl =
    artist.images && artist.images.length > 0
      ? artist.images[0].url
      : "/default-artist-image.jpg";

  const renderBasicCard = () => (
    <div
      className={`artist-card ${isSelected ? "selected" : ""}`}
      onClick={handleSelectToggle}
    >
      <div className="artist-card-image">
        <Image
          src={imageUrl}
          alt={artist.name}
          width={100}
          height={100}
          className="artist-image"
        />
        {isSelected && <div className="selected-badge">✓</div>}
      </div>
      <div className="artist-info">
        <h3 className="artist-name">{artist.name}</h3>
        {artist.genres && artist.genres.length > 0 && (
          <p className="artist-genres">
            {artist.genres.slice(0, 2).join(", ")}
          </p>
        )}
      </div>
    </div>
  );

  const renderDetailedCard = () => (
    <div
      className={`artist-card detailed ${isSelected ? "selected" : ""}`}
      onClick={toggleDetails}
    >
      {renderBasicCard()}

      {showDetails && (
        <div className="artist-details">
          <div className="top-tracks">
            <h4>Top Tracks:</h4>
            <ul>
              {artist.topTracks &&
                artist.topTracks.map((track) => (
                  <li key={track.id} className="track-item">
                    {track.name}
                    {track.previewUrl && (
                      <audio controls className="track-preview">
                        <source src={track.previewUrl} type="audio/mpeg" />
                      </audio>
                    )}
                  </li>
                ))}
            </ul>
          </div>

          <button
            className={`select-button ${isSelected ? "selected" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              handleSelectToggle();
            }}
          >
            {isSelected ? "Unselect" : "Select Artist"}
          </button>
        </div>
      )}
    </div>
  );

  return isDetailedView ? renderDetailedCard() : renderBasicCard();
}
