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

const AudioPlayer = ({ isPlaying, onPlayPause, currentTime }) => {
  // Format time as mm:ss
  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="audio-player">
      <button className="play-button" onClick={onPlayPause}>
        {isPlaying ? '⏸ Pause' : '▶ Play'}
      </button>
      {/* Range and time display kept for style, but not functional */}
      <input
        type="range"
        min="0"
        max={100}
        value={currentTime}
        onChange={() => { }}
        step="0.1"
        disabled
      />
      <span>
        {formatTime(currentTime)} / 0:00
      </span>
    </div>
  );
};

AudioPlayer.propTypes = {
  isPlaying: PropTypes.bool.isRequired,
  onPlayPause: PropTypes.func.isRequired,
  currentTime: PropTypes.number.isRequired,
};

export default AudioPlayer;
