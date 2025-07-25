import React from 'react';
import { Route, Routes, useParams, useNavigate } from 'react-router-dom';
import HeroSection from './HeroSection';
import Filter from './Filter';
import PodcastCard from './PodcastCard';
import Pagination from './Pagination';
import FavoritesPage from './FavoritesPage';
import PodcastListStatus from './PodcastListStatus';
import { genres } from '../data/data';

const AppRoutes = ({
    filteredPodcasts,
    displayedPodcasts,
    podcasts,
    isLoading,
    error,
    noResultsMessage,
    podcastsPerPage,
    currentPage,
    paginate,
    setSelectedPodcast,
    setIsPodcastModalOpen,
    setIsFullScreenModalOpen,
    navigate,
    id
}) => (
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
                    <PodcastListStatus
                        isLoading={isLoading}
                        error={error}
                        noResultsMessage={noResultsMessage}
                        onRetry={() => window.location.reload()}
                    />
                    {(!isLoading && !error && !noResultsMessage) && (
                        <>
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
);

export default AppRoutes;
