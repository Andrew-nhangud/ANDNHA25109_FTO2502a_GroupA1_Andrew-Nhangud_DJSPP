import React, { useState, useEffect } from 'react';
import { Route, Routes, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import PodcastModal from './components/PodcastModal';
import FullScreenModal from './components/FullScreenModal';
import AudioPlayer from './components/AudioPlayer';
import AppRoutes from './components/AppRoutes';
import { genres } from './data/data';
import { formatDate } from './utils/utils';
import { getLocalStorage, setLocalStorage, getEpisodeProgress, setEpisodeProgress } from './utils/localStorageUtils';
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
  // Global audio player state
  const [isPlaying, setIsPlaying] = useState(() => getLocalStorage('isPlaying', false));
  const [currentEpisode, setCurrentEpisode] = useState(() => getLocalStorage('currentEpisode', null));
  // Restore currentTime and duration for last played episode
  const [currentTime, setCurrentTime] = useState(() => getEpisodeProgress(getLocalStorage('currentEpisode', null)));
  const [duration, setDuration] = useState(() => {
    const stored = localStorage.getItem('duration');
    return stored ? Number(stored) : 0;
  });

  // Persist global player state
  useEffect(() => {
    setLocalStorage('isPlaying', isPlaying);
  }, [isPlaying]);

  useEffect(() => {
    // Save progress per episode
    if (currentEpisode) {
      setEpisodeProgress(currentEpisode, currentTime);
    }
  }, [currentTime, currentEpisode]);

  useEffect(() => {
    localStorage.setItem('duration', duration);
  }, [duration]);

  useEffect(() => {
    if (currentEpisode) {
      setLocalStorage('currentEpisode', currentEpisode);
    }
  }, [currentEpisode]);
  const [isDarkMode, setIsDarkMode] = useState(() => getLocalStorage('isDarkMode', false)); // Dark mode state

  // Context values
  const {
    searchTerm, setSearchTerm,
    selectedGenre, setSelectedGenre,
    sortOption, setSortOption,
    currentPage, setCurrentPage,
    podcastsPerPage
  } = usePodcastContext();

  // Persist currentPage to localStorage
  useEffect(() => {
    setLocalStorage('currentPage', currentPage);
  }, [currentPage]);

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

  // Handle play episode from FullScreenModal
  const handlePlayEpisode = (episodeInfo) => {
    setCurrentEpisode(episodeInfo);
    // Load progress for this episode
    const progress = getEpisodeProgress(episodeInfo);
    setCurrentTime(progress);
    setIsPlaying(true);
  };

  // Dark mode toggle function
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => {
      setLocalStorage('isDarkMode', !prevMode);
      return !prevMode;
    });
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
      <AppRoutes
        filteredPodcasts={filteredPodcasts}
        displayedPodcasts={displayedPodcasts}
        podcasts={podcasts}
        isLoading={isLoading}
        error={error}
        noResultsMessage={noResultsMessage}
        podcastsPerPage={podcastsPerPage}
        currentPage={currentPage}
        paginate={paginate}
        setSelectedPodcast={setSelectedPodcast}
        setIsPodcastModalOpen={setIsPodcastModalOpen}
        setIsFullScreenModalOpen={setIsFullScreenModalOpen}
        navigate={navigate}
        id={id}
      />
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
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        onPlayPause={handlePlayPause}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
        onPlayEpisode={handlePlayEpisode}
      />
      <AudioPlayer
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        currentTime={currentTime}
        audioSrc={currentEpisode ? currentEpisode.audioUrl : null}
        episode={currentEpisode}
        duration={duration}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
      />
    </div>
  );
};

export default App;
