// src/components/Carousel.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Carousel = ({ podcasts = [] }) => { // Default to an empty array
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsToShow = 3; // Number of items to show at once

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.ceil(podcasts.length / itemsToShow));
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + Math.ceil(podcasts.length / itemsToShow)) % Math.ceil(podcasts.length / itemsToShow));
    };

    // Debugging: Log the podcasts prop
    console.log("Podcasts in Carousel:", podcasts);

    return (
        <div className="carousel-container">
            <button className="carousel-button prev" onClick={prevSlide}>❮</button>
            <div className="carousel-slides">
                {podcasts.slice(currentIndex * itemsToShow, currentIndex * itemsToShow + itemsToShow).map((podcast) => (
                    <div key={podcast.id} className="carousel-item">
                        <Link to={`/podcast/${podcast.id}`}>
                            <img src={podcast.image} alt={`Cover art for ${podcast.title}`} />
                            <h2>{podcast.title}</h2>
                            <div className="podcast-genres">
                                {podcast.genres.map((genre) => (
                                    <span key={genre.id} className="genre-tag">{genre.title}</span>
                                ))}
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
            <button className="carousel-button next" onClick={nextSlide}>❯</button>
        </div>
    );
};

export default Carousel;
