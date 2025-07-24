import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { usePodcastContext } from '../PodcastContext';
import axios from 'axios';
import AudioPlayer from './AudioPlayer';
import heartOutline from '../assets/images/heart-outline.png';
import heartFilled from '../assets/images/heart-filled.png';

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
 * @param {string} props.audioSrc - The source URL of the audio to play.
 * @param {boolean} props.isPlaying - Whether the audio is currently playing.
 * @param {number} props.currentTime - The current playback time.
 * @param {number} props.duration - The total duration of the audio.
 * @param {function} props.onPlayPause - Function to handle play/pause.
 * @param {function} props.onTimeUpdate - Function to handle time updates.
 * @param {function} props.onDurationChange - Function to handle duration updates.
 * @returns {JSX.Element|null} The rendered FullScreenModal component or null if closed.
 */
const FullScreenModal = ({ podcast, isOpen, onClose, audioSrc, isPlaying, currentTime, duration, onPlayPause, onTimeUpdate, onDurationChange }) => {
  const { favorites, toggleFavorite } = usePodcastContext();
  const [seasonsData, setSeasonsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSeason, setExpandedSeason] = useState(null); // State to track which season is expanded

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
                      {season.episodes.map((episode) => {
                        const isFavorited = favorites.some(fav =>
                          fav.podcastId === podcast.id &&
                          fav.seasonNumber === season.season &&
                          fav.episodeNumber === episode.episode
                        );
                        return (
                          <div key={episode.episode} className="episode-item">
                            <img src={season.image} alt={`Cover image for ${season.title}`} className="episode-season-image" />
                            <div className="episode-info">
                              <span className="episode-number">Episode {episode.episode}</span>
                              <div className="episode-header">
                                <h4>{episode.title}</h4>
                                <button
                                  onClick={() => toggleFavorite({
                                    ...episode,
                                    podcastId: podcast.id,
                                    showTitle: podcast.title,
                                    seasonTitle: season.title,
                                    seasonNumber: season.season,
                                    episodeNumber: episode.episode
                                  })}
                                  className="favorite-btn"
                                  aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                                >
                                  <img
                                    src={isFavorited ? heartFilled : heartOutline}
                                    alt={isFavorited ? 'Favorited' : 'Not favorited'}
                                  />
                                </button>
                              </div>
                              <p className="episode-description">
                                {episode.description || "No description available."}
                              </p>
                              <audio controls>
                                <source src={episode.file} type="audio/mpeg" />
                                Your browser does not support the audio element.
                              </audio>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Render the AudioPlayer component */}
        <AudioPlayer
          audioSrc={audioSrc}
          isPlaying={isPlaying}
          onPlayPause={onPlayPause}
          onTimeUpdate={onTimeUpdate}
          onDurationChange={onDurationChange}
          currentTime={currentTime} // Pass current time to AudioPlayer
        />
      </div>
    </div>
  );
};

FullScreenModal.propTypes = {
  podcast: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    image: PropTypes.string,
    description: PropTypes.string,
    genres: PropTypes.array,
    updated: PropTypes.string,
    seasons: PropTypes.number
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  audioSrc: PropTypes.string.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  currentTime: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  onPlayPause: PropTypes.func.isRequired,
  onTimeUpdate: PropTypes.func.isRequired,
  onDurationChange: PropTypes.func.isRequired,
};

export default FullScreenModal;
