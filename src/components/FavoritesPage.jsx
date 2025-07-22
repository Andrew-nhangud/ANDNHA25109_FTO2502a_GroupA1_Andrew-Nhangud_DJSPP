// src/components/FavoritesPage.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const FavoritesPage = ({ favorites }) => {
  const [sortCriteria, setSortCriteria] = useState('title-asc'); // Default sorting criteria

  // Sort favorites based on the selected criteria
  const sortedFavorites = [...favorites].sort((a, b) => {
    if (sortCriteria === 'title-asc') {
      return a.title.localeCompare(b.title);
    } else if (sortCriteria === 'title-desc') {
      return b.title.localeCompare(a.title);
    } else if (sortCriteria === 'date-newest') {
      return new Date(b.dateAdded) - new Date(a.dateAdded);
    } else if (sortCriteria === 'date-oldest') {
      return new Date(a.dateAdded) - new Date(b.dateAdded);
    }
    return 0;
  });

  // Group favorites by show title
  const groupedFavorites = sortedFavorites.reduce((acc, episode) => {
    const showTitle = episode.showTitle; // Assuming showTitle is part of the episode data
    if (!acc[showTitle]) acc[showTitle] = [];
    acc[showTitle].push(episode);
    return acc;
  }, {});

  return (
    <div>
      <h1>Favorites</h1>
      <select onChange={(e) => setSortCriteria(e.target.value)} value={sortCriteria}>
        <option value="title-asc">Sort by Title (A-Z)</option>
        <option value="title-desc">Sort by Title (Z-A)</option>
        <option value="date-newest">Sort by Date Added (Newest First)</option>
        <option value="date-oldest">Sort by Date Added (Oldest First)</option>
      </select>
      {Object.keys(groupedFavorites).map(show => (
        <div key={show}>
          <h2>{show}</h2>
          {groupedFavorites[show].map(episode => (
            <div key={episode.id}>
              <h3>{episode.title}</h3>
              <p>Date Added: {episode.dateAdded.toLocaleString()}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

FavoritesPage.propTypes = {
  favorites: PropTypes.array.isRequired,
};

export default FavoritesPage;
