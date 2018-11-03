import { req, setCache as setSKCache, setApiKey as setSKApiKey } from './client';

export const setApiKey = appId => setSKApiKey(appId);

export const setCache = cache => setSKCache(cache);

export const getArtistCalendar = mbid =>
  req(`/artists/mbid:${encodeURIComponent(mbid)}/calendar.json`, {}, 'resultsPage', 'results', 'event');
