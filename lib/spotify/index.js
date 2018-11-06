import { Client, auth, cache } from './client';

export * from './error';

export class SpotifyClient extends Client {
  @auth
  getProfile() {
    return this.get('/me');
  }

  @auth
  getTopArtists() {
    return this.get('/me/top/artists', { limit: 50 }, 'items');
  }

  @auth
  getTopTracks() {
    return this.get('/me/top/tracks', { limit: 50 }, 'items');
  }

  searchArtists(q) {
    return this.get('/search', { q, type: 'artist' }, 'artists', 'items');
  }

  getArtist(id) {
    return this.get(`/artists/${id}`);
  }

  getArtistAlbums(id) {
    return this.get(`/artists/${id}/albums`, { limit: 50, market: 'CA', include_groups: 'album,single' }, 'items');
  }

  getArtistTopTracks(id) {
    return this.get(`/artists/${id}/top-tracks`, { country: 'CA' }, 'tracks');
  }

  searchTracks(trackName, artistName) {
    return this.get('/search', { q: `track:${trackName} AND artist:${artistName}`, type: 'track' }, 'tracks', 'items');
  }

  getAlbum(id) {
    return this.get(`/albums/${id}`);
  }

  getRecommendations({ artistIds = [], trackIds = [] }) {
    return this.get(
      '/recommendations',
      {
        seed_artists: artistIds.join(','),
        seed_tracks: trackIds.join(','),
        target_popularity: 50,
        limit: 100,
      },
      'tracks'
    );
  }

  @auth
  @cache({ disabled: true })
  getPlayer() {
    return this.get('/me/player');
  }

  @auth
  playTracks(trackIds) {
    return this.put('/me/player/play', { uris: trackIds.map(id => `spotify:track:${id}`) });
  }

  @auth
  pause() {
    return this.put('/me/player/pause');
  }
}
