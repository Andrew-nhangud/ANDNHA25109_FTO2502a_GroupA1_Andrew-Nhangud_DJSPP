// src/components/FullScreenModal.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

/**
 * FullScreenModal component for displaying podcast details in full screen.
 * 
 * This component fetches and displays detailed information about a specific podcast,
 * including its seasons and episodes. It also provides a button to close the modal.
 * 
 * @param {Object} props - Component props.
 * @param {Object} props.podcast - The podcast data to display.
 * @param {boolean} props.isOpen - Whether the modal is open.
 * @param {function} props.onClose - Function to close the modal.
 * @returns {JSX.Element|null} The rendered FullScreenModal component or null if closed.
 */
const FullScreenModal = ({ podcast, isOpen, onClose }) => {
  const [expandedSeason, setExpandedSeason] = useState(null); // State to track which season is expanded
  const [seasonsData, setSeasonsData] = useState([]); // State to hold seasons data
  const [isLoading, setIsLoading] = useState(true); // Loading state for fetching seasons data
  const [error, setError] = useState(null); // Error state for handling fetch errors

  // Effect to fetch seasons data when the podcast prop changes
  useEffect(() => {
    const fetchSeasonsData = async () => {
      if (podcast) {
        try {
          setIsLoading(true); // Set loading state
          const response = await axios.get(`https://podcast-api.netlify.app/id/${podcast.id}`);
          setSeasonsData(response.data.seasons); // Set seasonsData to the seasons array
          setError(null); // Clear any previous errors
        } catch (err) {
          setError("Failed to load seasons data. Please try again later."); // Set error message
        } finally {
          setIsLoading(false); // Reset loading state
        }
      }
    };

    fetchSeasonsData(); // Call the fetch function
  }, [podcast]);

  // Return null if the modal is not open or if no podcast is provided
  if (!isOpen || !podcast) return null;

  return (
    <div className={`full-screen-modal ${isOpen ? 'show' : ''}`}>
      <div className="full-screen-modal-content">
        <div className="full-screen-modal-header">
          <button className="back-btn" onClick={onClose}>
            &lt; Back to Podcast
          </button>
        </div>

        <div className="podcast-info-section">
          <img
            className="full-screen-modal-image"
            src={podcast.image}
            alt={`Cover art for ${podcast.title}`}
          />
          <div className="podcast-info-text">
            <h2>{podcast.title}</h2>
            <div className="genres">
              {podcast.genres?.length > 0 ? (
                podcast.genres.map((genre, index) => (
                  <span key={genre.id}>
                    {genre.title}
                    {index < podcast.genres.length - 1 ? ', ' : ''}
                  </span>
                ))
              ) : (
                <span>No genres available</span>
              )}
            </div>
            <p className="last-updated">
              Last updated: <span>{podcast.updated}</span>
            </p>
            <div className="seasons-count">
              {podcast.seasons > 0 
                ? `${podcast.seasons} season${podcast.seasons !== 1 ? 's' : ''}` 
                : "No seasons available"}
            </div>
            <p className="description">{podcast.description}</p>
          </div>
        </div>

        <div className="seasons-episodes-section">
          <h3>Seasons and Episodes</h3>
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading seasons...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p className="error-message">{error}</p>
            </div>
          ) : (
            <div className="seasons-list">
              {seasonsData.map((season) => (
                <div key={season.season} className="season-item">
                  <div 
                    className="season-header" 
                    onClick={() => setExpandedSeason(expandedSeason === season.season ? null : season.season)}
                    aria-expanded={expandedSeason === season.season}
                  >
                    <span className="season-title">{season.title}</span>
                    <span className="episodes-count">
                      {season.episodes.length} episode{season.episodes.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  {expandedSeason === season.season && (
                    <div className="season-episodes">
                      {season.episodes.map((episode) => (
                        <div key={episode.episode} className="episode-item">
                          <img src={season.image} alt={`Cover image for ${season.title}`} className="episode-season-image" />
                          <div className="episode-details">
                            <span className="episode-number">Episode {episode.episode}</span>
                            <span className="episode-title">{episode.title}</span>
                            <p className="episode-description">{episode.description || "No description available."}</p>
                            <audio controls>
                              <source src={episode.file} type="audio/mpeg" />
                              Your browser does not support the audio element.
                            </audio>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

FullScreenModal.propTypes = {
  podcast: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    image: PropTypes.string,
    description: PropTypes.string
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default FullScreenModal;
