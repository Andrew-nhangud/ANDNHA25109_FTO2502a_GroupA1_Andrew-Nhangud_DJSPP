// src/utils/localStorageUtils.js

export const getLocalStorage = (key, defaultValue = null) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // handle error if needed
  }
};

export const getEpisodeProgress = (ep) => {
  if (!ep) return 0;
  const key = `progress_${ep.podcastId}_${ep.seasonNumber}_${ep.episodeNumber}`;
  const progress = localStorage.getItem(key);
  return progress ? Number(progress) : 0;
};

export const setEpisodeProgress = (ep, time) => {
  if (!ep) return;
  const key = `progress_${ep.podcastId}_${ep.seasonNumber}_${ep.episodeNumber}`;
  localStorage.setItem(key, time);
};
