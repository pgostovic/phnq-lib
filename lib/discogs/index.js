import { req, setCache as setDiscogsCache, setCredentials as setDiscogsCredentials } from './client';

export const discogs = {
  setCredentials: credentials => setDiscogsCredentials(credentials),

  setCache: cache => setDiscogsCache(cache),

  getArtistEvents: (artistName, date = 'upcoming') =>
    req(`/artists/${encodeURIComponent(artistName)}/events`, { date }),
};
