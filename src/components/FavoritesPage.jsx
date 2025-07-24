import React, { useState } from 'react';
import { usePodcastContext } from '../PodcastContext';
import { Link } from 'react-router-dom';

const FavoritesPage = () => {
    const { favorites } = usePodcastContext();
    const [sortBy, setSortBy] = useState('date-newest');

    // Sort favorites before grouping
    const sortedFavorites = [...favorites].sort((a, b) => {
        if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
        if (sortBy === 'title-desc') return b.title.localeCompare(a.title);
        if (sortBy === 'date-newest') return new Date(b.dateAdded) - new Date(a.dateAdded);
        if (sortBy === 'date-oldest') return new Date(a.dateAdded) - new Date(b.dateAdded);
        return 0;
    });

    // Group sorted favorites by show → season → episodes
    const groupedFavorites = sortedFavorites.reduce((acc, episode) => {
        if (!acc[episode.showTitle]) acc[episode.showTitle] = {};
        if (!acc[episode.showTitle][episode.seasonTitle]) {
            acc[episode.showTitle][episode.seasonTitle] = [];
        }
        acc[episode.showTitle][episode.seasonTitle].push(episode);
        return acc;
    }, {});

    return (
        <div className="favorites-page container">
            <h1>Your Favorite Episodes</h1>

            <div className="sort-controls">
                <label htmlFor="sort-select">Sort by:</label>
                <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="date-newest">Date Added (Newest First)</option>
                    <option value="date-oldest">Date Added (Oldest First)</option>
                    <option value="title-asc">Title (A-Z)</option>
                    <option value="title-desc">Title (Z-A)</option>
                </select>
            </div>

            {favorites.length === 0 ? (
                <div className="no-favorites">
                    <p>You haven't favorited any episodes yet.</p>
                    <Link to="/" className="browse-link">Browse podcasts</Link>
                </div>
            ) : (
                <div className="favorites-list">
                    {Object.entries(groupedFavorites).map(([showTitle, seasons]) => (
                        <div key={showTitle} className="show-group">
                            <h2>{showTitle}</h2>
                            {Object.entries(seasons).map(([seasonTitle, episodes]) => (
                                <div key={seasonTitle} className="season-group">
                                    <h3>{seasonTitle}</h3>
                                    <div className="episodes-list">
                                        {episodes.map((episode) => (
                                            <div key={`id${episode.podcastId}-season${episode.seasonNumber}-episode${episode.episodeNumber}`} className="favorite-episode">
                                                <div className="episode-info">
                                                    <h4>{episode.title}</h4>
                                                    <p className="date-added">
                                                        Added: {new Date(episode.dateAdded).toLocaleString()}
                                                    </p>
                                                    {episode.description && (
                                                        <p className="episode-description">{episode.description}</p>
                                                    )}
                                                </div>
                                                <audio controls>
                                                    <source src={episode.file} type="audio/mpeg" />
                                                    Your browser does not support the audio element.
                                                </audio>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoritesPage;