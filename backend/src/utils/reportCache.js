const cache = new Map();

/* =========================
   GET CACHE
========================= */
export function getCache(key) {
  return cache.get(key);
}

/* =========================
   SET CACHE
========================= */
export function setCache(key, value, ttl = 60) {
  cache.set(key, value);

  setTimeout(() => {
    cache.delete(key);
  }, ttl * 1000);
}

/* =========================
   CLEAR CACHE
========================= */
export function clearCache(prefix = "") {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
  console.log("CACHE CLEARED:", prefix);
}
