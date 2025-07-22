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

  const toggleFavorite = (episode, showTitle, seasonTitle) => {
    setFavorites(prevFavorites => {
      const isFavorited = prevFavorites.some(fav => fav.id === episode.id);

      if (isFavorited) {
        return prevFavorites.filter(fav => fav.id !== episode.id);
      } else {
        return [
          ...prevFavorites,
          {
            ...episode,
            showTitle,
            seasonTitle,
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

