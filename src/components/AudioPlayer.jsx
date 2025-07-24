// src/components/AudioPlayer.jsx
import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * AudioPlayer component for playing audio content.
 * 
 * @param {Object} props - Component props.
 * @param {string} props.audioSrc - The source URL of the audio to play.
 * @param {boolean} props.isPlaying - Whether the audio is currently playing.
 * @param {function} props.onPlayPause - Function to handle play/pause.
 * @param {function} props.onTimeUpdate - Function to handle time updates.
 * @param {function} props.onDurationChange - Function to handle duration updates.
 * @param {number} props.currentTime - The current playback time.
 * @returns {JSX.Element} The rendered AudioPlayer component.
 */
const AudioPlayer = ({ audioSrc, isPlaying, onPlayPause, onTimeUpdate, onDurationChange, currentTime }) => {
  const audioRef = useRef(null); // Reference to the audio element

  // Effect to update current time and duration when audio metadata is loaded
  useEffect(() => {
    const audioElement = audioRef.current;

    const handleLoadedMetadata = () => {
      const duration = audioElement.duration;
      onDurationChange(duration); // Notify parent of duration change
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

  // Seek through the audio
  const handleSeek = (event) => {
    const seekTime = event.target.value;
    audioRef.current.currentTime = seekTime; // Update audio current time
  };

  // Format time as mm:ss
  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="audio-player">
      <audio
        ref={audioRef}
        src={audioSrc}
        style={{ display: 'none' }}
      />
      <button className="play-button" onClick={onPlayPause}>
        {isPlaying ? '⏸ Pause' : '▶ Play'}
      </button>
      <input
        type="range"
        min="0"
        max={audioRef.current?.duration || 0}
        value={currentTime}
        onChange={handleSeek}
        step="0.1"
      />
      <span>
        {formatTime(currentTime)} / {formatTime(audioRef.current?.duration || 0)}
      </span>
    </div>
  );
};

AudioPlayer.propTypes = {
  audioSrc: PropTypes.string.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  onPlayPause: PropTypes.func.isRequired,
  onTimeUpdate: PropTypes.func.isRequired,
  onDurationChange: PropTypes.func.isRequired,
  currentTime: PropTypes.number.isRequired, // Add currentTime prop type
};

export default AudioPlayer;
