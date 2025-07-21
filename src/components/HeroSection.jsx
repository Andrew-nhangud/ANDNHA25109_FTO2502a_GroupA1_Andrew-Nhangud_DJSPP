/**
 * HeroSection component for the landing page.
 * 
 * This component displays a title and a brief description to welcome users
 * and encourage them to explore the podcast collection.
 * 
 * @component
 * @returns {JSX.Element} The rendered HeroSection component.
 */
import React from 'react';

const HeroSection = () => {
  return (
    <section className="hero-section container">
      <h1>Discover Podcasts</h1>
      <p>Find your next favorite show from our curated collection</p>
    </section>
  );
};

export default HeroSection;
