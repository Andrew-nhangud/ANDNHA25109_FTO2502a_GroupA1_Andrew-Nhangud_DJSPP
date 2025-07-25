
# Podcast Hub

**Live Website:** [https://andnha-podacasthub.vercel.app/](https://andnha-podacasthub.vercel.app/)

## Features
- View detailed information about each podcast, including seasons and episodes.
- Responsive design for optimal viewing on various devices.
- Loading indicators for better user experience during data fetching.
- Error handling for failed API requests.

---

## Project Structure
src/
 ├── components/ # Reusable React components
 │ ├── AppRoutes.jsx # Handles all app routing and main page layouts
 │ ├── PodcastListStatus.jsx # Handles loading, error, and no results UI
 │ ├── Filter.jsx # Search and filter component
 │ ├── FullScreenModal.jsx # Modal for detailed podcast view
 │ ├── Header.jsx # Header component with branding and dark mode
 │ ├── HeroSection.jsx # Hero section for landing page
 │ ├── PodcastCard.jsx # Component for displaying individual podcast
 │ ├── PodcastModal.jsx # Modal for podcast details
 │ ├── Pagination.jsx # Pagination controls
 │ ├── AudioPlayer.jsx # Global audio player for episodes
 │ └── FavoritesPage.jsx # Displays user's favorite podcasts
 |
 ├── utils/ # Utility functions
 │ ├── utils.js # Functions for formatting and genre titles
 │ └── localStorageUtils.js # All localStorage get/set logic for app state and progress
 |
 ├── styles/ # CSS styles
 │ └── styles.css # Global styles for the application
 |
 ├── App.jsx # Main application component (now much cleaner)
 |
 └── main.jsx # Entry point for the React application

 
---


---

## How it Works

The application fetches podcast data from an external API and displays it in a user-friendly interface. Users can search for podcasts, filter them by genre, and sort them by date or title. When a podcast is selected, a modal displays detailed information, including the podcast's image, genres, last updated date, and seasons. The application handles loading states and errors gracefully to enhance user experience. Progress for each episode is saved using localStorage, so users can resume where they left off. A global audio player and mini progress bars for each episode are included.


### Key Features & Interactions
1. **Search for Podcasts**: Use the search bar to filter podcasts in real-time by title.
2. **Filter by Genre**: Select a genre from the dropdown to show only podcasts in that category.
3. **Sort Podcasts**: Sort by latest, oldest, or alphabetically (A-Z, Z-A).
4. **View Podcast Details**: Click a podcast card to open a modal with full details, including image, genres, last updated, and all seasons/episodes.
5. **Pagination**: Use pagination controls to browse through multiple pages of podcasts.
6. **Favorites**: Mark podcasts as favorites and view them on a dedicated favorites page.
7. **Audio Player**: Use the global audio player at the bottom to play episodes. Progress is saved per episode, and you can resume where you left off.
8. **Mini Progress Bars**: Each episode displays a mini progress bar showing your listening progress.
9. **Dark Mode**: Toggle dark mode for a better viewing experience.
10. **Persistent State**: All playback, progress, and UI preferences are saved in localStorage for a seamless experience across sessions.

---


## Learning Goals
- Build a React application with functional components and hooks.
- Manage state and side effects using React's `useState` and `useEffect` hooks.
- Implement API calls using Axios for data fetching.
- Create reusable components and manage component interactions.
- Use localStorage for persistent state and progress tracking.
- Refactor large components into smaller, maintainable files.
- Style components using CSS for a responsive, modern design.


## How to Run
1. Clone the repository:
   ```bash
   git clone https://github.com/Andrew-nhangud/ANDNHA25109_FTO2502a_GroupA1_Andrew-Nhangud_DJSPP.git
   ```
2. Navigate to the podcasthub subdirectory:
   ```bash
   cd podcasthub
   ```
3. Install project dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📝 Additional Notes

- Ensure you have **Node.js** and **npm** installed on your machine to run the application.
- The application is built using **Vite** and **React**, leveraging modern JavaScript features and best practices.

## 📚 JSDoc Comments

All components and utility functions in the project are documented using **JSDoc** comments. These annotations include:

- Purpose of the function or component
- Parameters with their types and descriptions
- Return types and what they represent

This documentation supports better code readability, maintainability, and onboarding for future collaborators.