import { req, setCache as setSKCache, setApiKey as setSKApiKey } from './client';

export const songkick = {
  setApiKey: appId => setSKApiKey(appId),

  setCache: cache => setSKCache(cache),

  getArtistCalendar: mbid =>
    req(`/artists/mbid:${encodeURIComponent(mbid)}/calendar.json`, {}, 'resultsPage', 'results', 'event'),
};
