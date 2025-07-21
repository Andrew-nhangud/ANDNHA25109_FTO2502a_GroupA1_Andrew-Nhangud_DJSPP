import React from 'react';
import { usePodcastContext } from '../PodcastContext';
import searchIcon from '../assets/images/search-icon.png';

/**
 * Filter component for searching and filtering podcasts.
 * 
 * @param {Object} props - Component props.
 * @param {Array} props.genres - List of podcast genres.
 * @returns {JSX.Element} The rendered Filter component.
 */
const Filter = ({ genres }) => {
  const {
    searchTerm, setSearchTerm,
    sortOption, setSortOption,
    selectedGenre, setSelectedGenre
  } = usePodcastContext();

  // Handle changes in the search input
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle changes in the sort option
  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  // Handle changes in the selected genre
  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  return (
    <section className="filter container">
      <div className="searchBar-container">
        <img src={searchIcon} alt="search icon" />
        <input
          type="text"
          placeholder="Search podcasts..."
          className="search-bar"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="dropdown-menus">
        <select 
          id="genre-select" 
          name="genre" 
          value={selectedGenre} 
          onChange={handleGenreChange}
          aria-label="Filter by genre"
        >
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.title}
            </option>
          ))}
        </select>
        <select 
          id="sort-select" 
          name="sort" 
          value={sortOption} 
          onChange={handleSortChange}
          aria-label="Sort podcasts"
        >
          <option value="">Sort By</option>
          <option value="latest">Last Updated (Newest First)</option>
          <option value="oldest">Last Updated (Oldest First)</option>
          <option value="title-asc">Title (A-Z)</option>
          <option value="title-desc">Title (Z-A)</option>
        </select>
      </div>
    </section>
  );
};

export default Filter;
