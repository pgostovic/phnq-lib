import { req, setCache as setBITCache, setAppId as setBITAppId } from './client';

export const bandsintown = {
  setAppId: appId => setBITAppId(appId),

  setCache: cache => setBITCache(cache),

  getArtistEvents: (artistName, date = 'upcoming') =>
    req(`/artists/${encodeURIComponent(artistName)}/events`, { date }),
};
