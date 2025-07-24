// src/components/HeroSection.jsx
import React from 'react';
import Carousel from './Carousel'; // Import the Carousel component

const HeroSection = ({ podcasts, onSelect, setPodcastModalOpen, setFullScreenModalOpen }) => {
  return (
    <section className="hero-section container">
      <h1>Discover Podcasts</h1>
      <p>Find your next favorite show from our curated collection</p>
      <Carousel
        podcasts={podcasts}
        onSelect={onSelect}
        setPodcastModalOpen={setPodcastModalOpen}
        setFullScreenModalOpen={setFullScreenModalOpen}
      />
    </section>
  );
};

export default HeroSection;
