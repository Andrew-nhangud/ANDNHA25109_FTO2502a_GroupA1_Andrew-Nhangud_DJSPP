import React from 'react';

const PodcastListStatus = ({ isLoading, error, noResultsMessage, onRetry }) => {
    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading podcasts...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <button className="retry-button" onClick={onRetry}>
                    Retry
                </button>
            </div>
        );
    }
    if (noResultsMessage) {
        return <p className="no-results-message">{noResultsMessage}</p>;
    }
    return null;
};

export default PodcastListStatus;
