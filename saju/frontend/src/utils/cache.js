const CACHE_KEY = 'saju_results';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24시간

export const cacheResult = (birthData, result) => {
  const cache = {
    timestamp: Date.now(),
    data: result
  };
  
  try {
    const cacheData = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    cacheData[JSON.stringify(birthData)] = cache;
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (e) {
    console.error('Cache save failed:', e);
  }
};

export const getCachedResult = (birthData) => {
  try {
    const cacheData = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    const cache = cacheData[JSON.stringify(birthData)];
    
    if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
      return cache.data;
    }
  } catch (e) {
    console.error('Cache read failed:', e);
  }
  
  return null;
}; 