import React, { useState, useEffect } from 'react';
import { Route, Routes, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Filter from './components/Filter';
import PodcastCard from './components/PodcastCard';
import PodcastModal from './components/PodcastModal';
import FullScreenModal from './components/FullScreenModal';
import Pagination from './components/Pagination';
import { genres } from './data/data';
import { formatDate } from './utils/utils';
import { usePodcastContext } from './PodcastContext';

/**
 * Main App component that fetches and displays podcasts.
 * 
 * This component manages the state for podcasts, loading status, error messages,
 * and the currently selected podcast. It also handles filtering and pagination
 * of the podcast list.
 * 
 * @returns {JSX.Element} The rendered App component.
 */
const App = () => {
  // State variables
  const [podcasts, setPodcasts] = useState([]); // All podcasts
  const [filteredPodcasts, setFilteredPodcasts] = useState([]); // Podcasts after filtering
  const [displayedPodcasts, setDisplayedPodcasts] = useState([]); // Podcasts to display on the current page
  const [selectedPodcast, setSelectedPodcast] = useState(null); // Currently selected podcast for modal
  const [isFullScreenModalOpen, setIsFullScreenModalOpen] = useState(false); // State for full-screen modal visibility
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [noResultsMessage, setNoResultsMessage] = useState(''); // Message for no results

  // Context values for search, genre, sort, pagination
  const {
    searchTerm, setSearchTerm,
    selectedGenre, setSelectedGenre,
    sortOption, setSortOption,
    currentPage, setCurrentPage,
    podcastsPerPage
  } = usePodcastContext();

  // Effect to fetch podcasts from the API
  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        setIsLoading(true); // Set loading state
        const response = await axios.get('https://podcast-api.netlify.app/');
        
        // Map response data to include genre titles and formatted dates
        const podcastsWithGenres = response.data.map(podcast => ({
          ...podcast,
          genres: podcast.genres.map(genreId => 
            genres.find(g => g.id === genreId) || { id: genreId, title: 'Unknown' }
          ).filter(Boolean),
          updated: formatDate(podcast.updated)
        }));
        
        setPodcasts(podcastsWithGenres); // Set podcasts state
        setFilteredPodcasts(podcastsWithGenres); // Set filtered podcasts state
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error("Error fetching podcasts:", err);
        setError("Failed to load podcasts. Please try again later."); // Set error message
      } finally {
        setIsLoading(false); // Reset loading state
      }
    };

    fetchPodcasts(); // Call the function directly within the useEffect
  }, []);

  // Effect to filter podcasts based on search term and selected genre
  useEffect(() => {
    const filterPodcasts = () => {
      let filtered = [...podcasts]; // Start with all podcasts

      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(podcast =>
          podcast.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Filter by selected genre
      if (selectedGenre) {
        filtered = filtered.filter(podcast => 
          podcast.genres.some(genre => genre.id === parseInt(selectedGenre))
        );
      }

      // Sort podcasts based on selected sort option
      if (sortOption) {
        switch(sortOption) {
          case 'latest':
            filtered.sort((a, b) => new Date(b.updated) - new Date(a.updated));
            break;
          case 'oldest':
            filtered.sort((a, b) => new Date(a.updated) - new Date(b.updated));
            break;
          case 'title-asc':
            filtered.sort((a, b) => a.title.localeCompare(b.title));
            break;
          case 'title-desc':
            filtered.sort((a, b) => b.title.localeCompare(a.title));
            break;
          default:
            break;
        }
      }

      setFilteredPodcasts(filtered); // Update filtered podcasts state
      setNoResultsMessage(filtered.length === 0 ? 'No podcasts found matching your criteria.' : ''); // Set no results message
    };

    filterPodcasts(); // Call the filter function
  }, [searchTerm, selectedGenre, sortOption, podcasts]);

  // Effect to handle pagination
  useEffect(() => {
    const indexOfLastPodcast = currentPage * podcastsPerPage; // Calculate index of last podcast
    const indexOfFirstPodcast = indexOfLastPodcast - podcastsPerPage; // Calculate index of first podcast
    setDisplayedPodcasts(filteredPodcasts.slice(indexOfFirstPodcast, indexOfLastPodcast)); // Set displayed podcasts for current page
  }, [filteredPodcasts, currentPage, podcastsPerPage]);

  // Get podcast ID from URL
  const { id } = useParams(); // Extract podcast ID from URL
  const navigate = useNavigate(); // Hook for navigation

  // Effect to open modal based on URL
  useEffect(() => {
    if (id) {
      const selectedPodcast = podcasts.find(podcast => podcast.id === id);
      if (selectedPodcast) {
        setSelectedPodcast(selectedPodcast); // Set the selected podcast
        setIsFullScreenModalOpen(true); // Open the full-screen modal
      }
    }
  }, [id, podcasts]);

  // Function to handle pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <Header />
      <HeroSection />
      <Filter 
        onSearch={setSearchTerm} 
        onSort={setSortOption} 
        onGenreSelect={setSelectedGenre} 
        genres={genres}
      />
      
      <section className="podcast-card container">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading podcasts...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button className="retry-button" onClick={fetchPodcasts}>Retry</button>
          </div>
        ) : (
          <>
            {noResultsMessage && <p className="no-results-message">{noResultsMessage}</p>}
            {displayedPodcasts.map((podcast) => (
              <PodcastCard 
                key={podcast.id} 
                podcast={podcast} 
                onSelect={setSelectedPodcast} 
              />
            ))}
          </>
        )}
      </section>

      <div className="pagination-container">
        <Pagination
          podcastsPerPage={podcastsPerPage}
          totalPodcasts={filteredPodcasts.length}
          currentPage={currentPage}
          paginate={paginate}
        />
      </div>

      <PodcastModal 
        podcast={selectedPodcast} 
        onClose={() => {
          setSelectedPodcast(null);
          navigate('/'); // Navigate back to the landing page
        }} 
        onViewMore={() => setIsFullScreenModalOpen(true)} 
      />
      <FullScreenModal 
        podcast={selectedPodcast} 
        isOpen={isFullScreenModalOpen} 
        onClose={() => {
          setIsFullScreenModalOpen(false);
          navigate('/'); // Navigate back to the landing page
        }} 
      />
    </div>
  );
};

export default App;
