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


const AudioPlayer = ({ audioSrc, isPlaying, onPlayPause, currentTime, onTimeUpdate, onDurationChange, duration, episode }) => {
  const audioRef = useRef(null);
  // Format time as mm:ss
  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Play/pause effect
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => { });
    } else {
      audio.pause();
    }
  }, [isPlaying, audioSrc]);

  // Seek to currentTime when episode/audioSrc or currentTime changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && currentTime != null && Math.abs(audio.currentTime - currentTime) > 0.5) {
      audio.currentTime = currentTime;
    }
  }, [audioSrc, episode, currentTime]);

  // Handle time update
  const handleTimeUpdate = (e) => {
    if (onTimeUpdate) {
      onTimeUpdate(e.target.currentTime);
    }
  };

  // Handle duration change
  const handleLoadedMetadata = (e) => {
    if (onDurationChange) {
      onDurationChange(e.target.duration);
    }
  };

  // Handle manual seek
  const handleSeek = (e) => {
    const seekTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
    if (onTimeUpdate) {
      onTimeUpdate(seekTime);
    }
  };

  return (
    <div className="audio-player">
      {audioSrc ? (
        <audio
          ref={audioRef}
          src={audioSrc}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          preload="auto"
        />
      ) : null}
      <button className="play-button" onClick={onPlayPause} disabled={!audioSrc}>
        {isPlaying ? '⏸ Pause' : '▶ Play'}
      </button>
      <input
        type="range"
        min={0}
        max={duration || 0}
        value={currentTime}
        onChange={handleSeek}
        step="0.1"
        disabled={!audioSrc}
      />
      <span>
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
      {episode && (
        <span className="audio-episode-title">{episode.episodeTitle}</span>
      )}
    </div>
  );
};

AudioPlayer.propTypes = {
  audioSrc: PropTypes.string,
  isPlaying: PropTypes.bool.isRequired,
  onPlayPause: PropTypes.func.isRequired,
  currentTime: PropTypes.number.isRequired,
  onTimeUpdate: PropTypes.func,
  onDurationChange: PropTypes.func,
  duration: PropTypes.number,
  episode: PropTypes.object,
};

export default AudioPlayer;
