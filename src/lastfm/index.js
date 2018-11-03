import Client, { cache } from './client';

export default class LastFMClient extends Client {
  // @cache({ disabled: true })
  getArtistInfo({ mbid, artist }) {
    return this.req('artist.getinfo', { mbid, artist }, 'artist');
  }

  getArtistTopTags(artistName) {
    return this.req('artist.gettoptags', { artist: artistName }, 'toptags', 'tag');
  }

  getArtistTopAlbums(artistName) {
    return this.req('artist.gettopalbums', { artist: artistName }, 'topalbums', 'album');
  }

  getAlbumTopTags(artistName, albumName) {
    return this.req('album.gettoptags', { artist: artistName, album: albumName }, 'toptags', 'tag');
  }

  getSimilarArtists(artistName, limit = 10) {
    return this.req('artist.getsimilar', { artist: artistName, autocorrect: 1, limit }, 'similarartists', 'artist');
  }

  getTagInfo(tag) {
    return this.req('tag.getInfo', { tag }, 'tag');
  }

  getSimilarTags(tag) {
    return this.req('tag.getsimilar', { tag }, 'similartags', 'tag');
  }

  getTagTopArtists(tag, limit = 20) {
    return this.req('tag.gettopartists', { tag, limit }, 'topartists', 'artist');
  }

  getTagTopTracks(tag) {
    return this.req('tag.gettoptracks', { tag, limit: 15 }, 'tracks', 'track');
  }
}
