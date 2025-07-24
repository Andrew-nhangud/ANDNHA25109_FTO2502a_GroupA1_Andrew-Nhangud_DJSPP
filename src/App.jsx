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
import AudioPlayer from './components/AudioPlayer';
import FavoritesPage from './components/FavoritesPage';
import { genres } from './data/data';
import { formatDate } from './utils/utils';
import { usePodcastContext } from './PodcastContext';
import './styles/styles.css';

const App = () => {
  // State variables
  const [podcasts, setPodcasts] = useState([]);
  const [filteredPodcasts, setFilteredPodcasts] = useState([]);
  const [displayedPodcasts, setDisplayedPodcasts] = useState([]);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const [isPodcastModalOpen, setIsPodcastModalOpen] = useState(false);
  const [isFullScreenModalOpen, setIsFullScreenModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noResultsMessage, setNoResultsMessage] = useState('');
  const [audioSrc, setAudioSrc] = useState('https://podcast-api.netlify.app/placeholder-audio.mp3');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode state

  // Context values
  const {
    searchTerm, setSearchTerm,
    selectedGenre, setSelectedGenre,
    sortOption, setSortOption,
    currentPage, setCurrentPage,
    podcastsPerPage
  } = usePodcastContext();

  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch podcasts from API
  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('https://podcast-api.netlify.app/');

        const podcastsWithGenres = response.data.map(podcast => ({
          ...podcast,
          genres: podcast.genres.map(genreId =>
            genres.find(g => g.id === genreId) || { id: genreId, title: 'Unknown' }
          ).filter(Boolean),
          updated: formatDate(podcast.updated)
        }));

        setPodcasts(podcastsWithGenres);
        setFilteredPodcasts(podcastsWithGenres);
        setError(null);
      } catch (err) {
        console.error("Error fetching podcasts:", err);
        setError("Failed to load podcasts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  // Handle URL-based modal opening
  useEffect(() => {
    if (id && podcasts.length > 0) {
      const selected = podcasts.find(podcast => podcast.id === id);
      if (selected) {
        setSelectedPodcast(selected);
        setIsFullScreenModalOpen(true);
      }
    }
  }, [id, podcasts]);

  // Filter podcasts based on search and genre
  useEffect(() => {
    const filterPodcasts = () => {
      let filtered = [...podcasts];

      if (searchTerm) {
        filtered = filtered.filter(podcast =>
          podcast.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (selectedGenre) {
        filtered = filtered.filter(podcast =>
          podcast.genres.some(genre => genre.id === parseInt(selectedGenre))
        );
      }

      if (sortOption) {
        switch (sortOption) {
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

      setFilteredPodcasts(filtered);
      setNoResultsMessage(filtered.length === 0 ? 'No podcasts found matching your criteria.' : '');
    };

    filterPodcasts();
  }, [searchTerm, selectedGenre, sortOption, podcasts]);

  // Handle pagination
  useEffect(() => {
    const indexOfLastPodcast = currentPage * podcastsPerPage;
    const indexOfFirstPodcast = indexOfLastPodcast - podcastsPerPage;
    setDisplayedPodcasts(filteredPodcasts.slice(indexOfFirstPodcast, indexOfLastPodcast));
  }, [filteredPodcasts, currentPage, podcastsPerPage]);

  // Pagination function
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Audio player functions
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = (time) => {
    setCurrentTime(time);
  };

  const handleDurationChange = (duration) => {
    setDuration(duration);
  };

  // Dark mode toggle function
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // Effect to apply dark mode class to body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  return (
    <div className="app-container">
      <Header toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      <Routes>
        <Route path="/" element={
          <>
            <HeroSection
              podcasts={filteredPodcasts}
              onSelect={(podcast) => {
                setSelectedPodcast(podcast);
                setIsPodcastModalOpen(true);
              }}
              setPodcastModalOpen={setIsPodcastModalOpen}
              setFullScreenModalOpen={setIsFullScreenModalOpen}
            />
            <Filter genres={genres} />
            <section className="podcast-card container">
              {isLoading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Loading podcasts...</p>
                </div>
              ) : error ? (
                <div className="error-container">
                  <p className="error-message">{error}</p>
                  <button
                    className="retry-button"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  {noResultsMessage && (
                    <p className="no-results-message">{noResultsMessage}</p>
                  )}
                  {displayedPodcasts.map((podcast) => (
                    <PodcastCard
                      key={podcast.id}
                      podcast={podcast}
                      onSelect={(selected) => {
                        setSelectedPodcast(selected);
                        navigate(`/podcast/${selected.id}`);
                      }}
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
          </>
        } />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/podcast/:id" element={
          <>
            <HeroSection />
            <Filter genres={genres} />
            <section className="podcast-card container">
              {podcasts.filter(p => p.id === id).map(podcast => (
                <PodcastCard
                  key={podcast.id}
                  podcast={podcast}
                  onSelect={(selected) => {
                    setSelectedPodcast(selected);
                    navigate(`/podcast/${selected.id}`);
                  }}
                />
              ))}
            </section>
          </>
        } />
      </Routes>
      <PodcastModal
        podcast={selectedPodcast}
        onClose={() => {
          setIsPodcastModalOpen(false);
          setSelectedPodcast(null);
          navigate('/');
        }}
        onViewMore={() => {
          setIsPodcastModalOpen(false);
          setIsFullScreenModalOpen(true);
        }}
      />
      <FullScreenModal
        podcast={selectedPodcast}
        isOpen={isFullScreenModalOpen}
        onClose={() => {
          setIsFullScreenModalOpen(false);
          setSelectedPodcast(null);
          navigate('/');
        }}
        audioSrc={audioSrc}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        onPlayPause={handlePlayPause}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
      />
      <AudioPlayer
        audioSrc={audioSrc}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
        currentTime={currentTime}
      />
    </div>
  );
};

export default App;
