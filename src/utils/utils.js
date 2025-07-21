// utils.js

// Function to get genre titles from genre IDs
function getGenreTitles(genreIds) {
  const genreMap = {
    1: "Personal Growth",
    2: "Investigative Journalism",
    3: "History",
    4: "Comedy",
    5: "Entertainment",
    6: "Business",
    7: "Fiction",
    8: "News",
    9: "Kids and Family",
  };
  return genreIds.map((id) => genreMap[id]).filter(Boolean);
}

// Function to format the date
function formatDate(dateString) {
  const options = { day: "numeric", month: "long", year: "numeric" };
  return new Date(dateString).toLocaleDateString("en-GB", options);
}

// Export the utility functions
export { getGenreTitles, formatDate };
