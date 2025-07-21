import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

/**
 * PodcastCard component for displaying individual podcast information.
 * 
 * @param {Object} props - Component props.
 * @param {Object} props.podcast - The podcast data to display.
 * @param {function} props.onSelect - Function to handle podcast selection.
 * @returns {JSX.Element} The rendered PodcastCard component.
 */
const PodcastCard = ({ podcast, onSelect }) => {
  const navigate = useNavigate(); // Hook for navigation

  // Handle click event to navigate to podcast details
  const handleClick = () => {
    onSelect(podcast); // Set the selected podcast
    navigate(`/podcast/${podcast.id}`); // Navigate to the dynamic route
  };

  return (
    <div className="innerPodcast-card" onClick={handleClick}>
      <img 
        src={podcast.image} 
        alt={`Cover art for ${podcast.title}`} 
        className="podcast-image"
      />
      <div className="podcast-card-info">
        <h1 className="podcast-title">{podcast.title}</h1>
        <div className="podcast-categories">
          {podcast.genres.map((genre) => (
            <span key={genre.id} className="podcast-categories-items">
              {genre.title}
            </span>
          ))}
        </div>
        <p className="season-info">{podcast.seasons} Season{podcast.seasons !== 1 ? 's' : ''}</p>
        <p className="date">Last updated: {podcast.updated}</p>
      </div>
    </div>
  );
};

PodcastCard.propTypes = {
  podcast: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    genres: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired
      })
    ).isRequired,
    seasons: PropTypes.number.isRequired,
    updated: PropTypes.string.isRequired
  }).isRequired,
  onSelect: PropTypes.func.isRequired
};

export default PodcastCard;
