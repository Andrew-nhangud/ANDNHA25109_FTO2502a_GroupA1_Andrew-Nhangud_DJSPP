import React from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../utils/utils';

/**
 * PodcastModal component for displaying podcast details in a modal.
 * 
 * @param {Object} props - Component props.
 * @param {Object} props.podcast - The podcast data to display.
 * @param {function} props.onClose - Function to close the modal.
 * @param {function} props.onViewMore - Function to view more details.
 * @returns {JSX.Element|null} The rendered PodcastModal component or null if no podcast is selected.
 */
const PodcastModal = ({ podcast, onClose, onViewMore }) => {
  if (!podcast) return null; // Return null if no podcast is selected

  return (
    <div className={`modal ${podcast ? 'show' : ''}`}>
      <div className="modal-content">
        <div className="modalContent-header">
          <h2 id="modalTitle">{podcast.title}</h2>
          <span className="close-button" onClick={onClose}>&times;</span>
        </div>

        <hr className="line-diveder" />

        <div className="modalContent-info">
          <img 
            id="modalImage" 
            src={podcast.image} 
            alt={`Cover art for ${podcast.title}`} 
          />

          <div className="modalContent-details">
            <div className="genres">
              {podcast.genres && podcast.genres.length > 0 ? (
                podcast.genres.map((genre, index) => (
                  <span 
                    key={genre.id} 
                    className="genre-tag"
                  >
                    {genre.title}
                    {index < podcast.genres.length - 1 ? ', ' : ''}
                  </span>
                ))
              ) : (
                <span className="no-genres">No genres available</span>
              )}
            </div>

            <p className="last-updated">
              Last updated: <span>{podcast.updated}</span>
            </p>

            <div className="seasons">
              {podcast.seasons > 0 
                ? `${podcast.seasons} season${podcast.seasons !== 1 ? 's' : ''}` 
                : "No seasons available"
              }
            </div>

            <p className="description">{podcast.description}</p>

            <button 
              className="view-more-btn" 
              onClick={onViewMore}
              aria-label="View more details"
            >
              View More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

PodcastModal.propTypes = {
  podcast: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    image: PropTypes.string,
    genres: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string
      })
    ),
    seasons: PropTypes.number,
    updated: PropTypes.string,
    description: PropTypes.string
  }),
  onClose: PropTypes.func.isRequired,
  onViewMore: PropTypes.func.isRequired
};

export default PodcastModal;
