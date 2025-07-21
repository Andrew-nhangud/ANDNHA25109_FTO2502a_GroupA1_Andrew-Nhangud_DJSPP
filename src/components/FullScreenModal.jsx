// src/components/FullScreenModal.jsx
import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import AudioPlayer from './AudioPlayer'; // Import the AudioPlayer component

/**
 * FullScreenModal component for displaying podcast details in full screen.
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
  const audioRef = useRef(null); // Reference to the audio element

  // Effect to update current time and duration when audio metadata is loaded
  useEffect(() => {
    const audioElement = audioRef.current;

    const handleLoadedMetadata = () => {
      const audioDuration = audioElement.duration;
      onDurationChange(audioDuration); // Notify parent of duration change
    };

    const handleTimeUpdate = () => {
      const time = audioElement.currentTime;
      onTimeUpdate(time); // Notify parent of time update
    };

    if (audioElement) {
      audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioElement.addEventListener('timeupdate', handleTimeUpdate);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, [onTimeUpdate, onDurationChange]);

  // Effect to play/pause audio based on isPlaying state
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Effect to set current time when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = currentTime; // Set current time
    }
  }, [currentTime]);

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
    description: PropTypes.string
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