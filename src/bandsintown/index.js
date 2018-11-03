import { req, setCache as setBITCache, setAppId as setBITAppId } from './client';

export const setAppId = appId => setBITAppId(appId);

export const setCache = cache => setBITCache(cache);

export const getArtistEvents = (artistName, date = 'upcoming') =>
  req(`/artists/${encodeURIComponent(artistName)}/events`, { date });
