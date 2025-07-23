import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Carousel = ({ podcasts = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsToShow = window.innerWidth < 768 ? 1 : 3; // Show 1 item on small screens, 3 on larger screens

    const totalItems = Math.min(podcasts.length, 6); // Limit to 6 items

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + totalItems) % totalItems);
    };

    return (
        <div className="carousel-container">
            <button className="carousel-button prev" onClick={prevSlide}>❮</button>
            <div className="carousel-slides" style={{ transform: `translateX(-${(currentIndex * (100 / itemsToShow))}%)` }}>
                {podcasts.slice(0, 6).map((podcast) => ( // Show only the first 6 podcasts
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
