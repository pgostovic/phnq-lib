import { req, setCache as setDiscogsCache, setCredentials as setDiscogsCredentials } from './client';

export const setCredentials = credentials => setDiscogsCredentials(credentials);

export const setCache = cache => setDiscogsCache(cache);

export const getArtistEvents = (artistName, date = 'upcoming') =>
  req(`/artists/${encodeURIComponent(artistName)}/events`, { date });
