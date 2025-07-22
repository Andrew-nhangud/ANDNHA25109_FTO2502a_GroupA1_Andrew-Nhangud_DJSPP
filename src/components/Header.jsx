import React from 'react';
import { Link } from 'react-router-dom';
import headphonesIcon from '../assets/images/headphones-icon.png';
import profilePictureIcon from '../assets/images/profile-picture-icon.png';
import heartFilled from '../assets/images/heart-filled.png';
import '../styles/styles.css';

const Header = () => {
  return (
    <header className="header-container">
      <div className="innerHeader-container container">
        <div className="rightSide-icons">
          <img src={headphonesIcon} alt="headphones icon" />
          <Link to="/" className="logo-link">
            <h1>Podcast<span>Hub</span></h1>
          </Link>
        </div>
        <div className="leftSide-icons">
          <Link to="/favorites" className="favorites-link">
            <img src={heartFilled} alt="Favorites" />
          </Link>
          <img src={profilePictureIcon} alt="profile" className="profile-icon" />
        </div>
      </div>
    </header>
  );
};

export default Header;
