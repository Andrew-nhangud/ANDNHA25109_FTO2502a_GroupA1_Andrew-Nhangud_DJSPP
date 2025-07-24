import React, { createContext, useContext, useState, useEffect } from 'react';

const PodcastContext = createContext();

export const PodcastProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [podcastsPerPage] = useState(8);
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage on initial render
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (episode) => {
    setFavorites(prevFavorites => {
      const isFavorited = prevFavorites.some(fav => fav.podcastId === episode.podcastId && fav.seasonNumber === episode.seasonNumber && fav.episodeNumber === episode.episodeNumber);

      if (isFavorited) {
        return prevFavorites.filter(fav => !(fav.podcastId === episode.podcastId && fav.seasonNumber === episode.seasonNumber && fav.episodeNumber === episode.episodeNumber));
      } else {
        return [
          ...prevFavorites,
          {
            ...episode,
            showTitle: episode.showTitle,
            seasonTitle: episode.seasonTitle,
            dateAdded: new Date().toISOString()
          }
        ];
      }
    });
  };

  return (
    <PodcastContext.Provider value={{
      searchTerm, setSearchTerm,
      selectedGenre, setSelectedGenre,
      sortOption, setSortOption,
      currentPage, setCurrentPage,
      podcastsPerPage,
      favorites,
      toggleFavorite
    }}>
      {children}
    </PodcastContext.Provider>
  );
};

export const usePodcastContext = () => useContext(PodcastContext);

