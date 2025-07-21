import React, { createContext, useContext, useState } from 'react';

// Create a context for the podcast data
const PodcastContext = createContext();

/**
 * PodcastProvider component that provides podcast-related state and functions
 * to its children via context.
 * 
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components that will have access to the context.
 * @returns {JSX.Element} The rendered PodcastProvider component.
 */
export const PodcastProvider = ({ children }) => {
  // State variables for managing podcast-related data
  const [searchTerm, setSearchTerm] = useState(''); // Search term for filtering podcasts
  const [selectedGenre, setSelectedGenre] = useState(''); // Selected genre for filtering
  const [sortOption, setSortOption] = useState(''); // Selected sort option for podcasts
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [podcastsPerPage] = useState(8); // Number of podcasts to display per page

  return (
    <PodcastContext.Provider value={{
      searchTerm, setSearchTerm,
      selectedGenre, setSelectedGenre,
      sortOption, setSortOption,
      currentPage, setCurrentPage,
      podcastsPerPage
    }}>
      {children} {/* Render child components */}
    </PodcastContext.Provider>
  );
};

/**
 * Custom hook to use the PodcastContext.
 * 
 * @returns {Object} The context values.
 */
export const usePodcastContext = () => useContext(PodcastContext);
