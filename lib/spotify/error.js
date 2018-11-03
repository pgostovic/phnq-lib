class SpotifyError extends Error {
  constructor(status, message) {
    super(message);

    /**
     * In instances of Error subclasses, the instance.constructor.name ends up
     * as 'Error' instead of the class name (SpotifyError in this case). The
     * following line seems to fix it...
     *    https://github.com/Microsoft/TypeScript/issues/14099
     */
    Object.setPrototypeOf(this, SpotifyError.prototype);

    this.status = status;

    if (status === 401) {
      this.redirectUrl = getAuthorizeUrl();
    }
  }
}

const getAuthorizeUrl = () => {
  const redirectUri = process.env.SPOTIFY_CLIENT_REDIRECT_URI;

  const scopes = [
    'user-top-read',
    'playlist-modify-public',
    'user-read-playback-state',
    'streaming',
    'user-read-birthdate',
    'user-read-email',
    'user-read-private',
  ];

  const params = {
    client_id: process.env.SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: scopes.join(','),
  };

  const q = Object.keys(params)
    .sort()
    .map(k => [k, encodeURIComponent(params[k])].join('='))
    .join('&');

  return `https://accounts.spotify.com/authorize?${q}`;
};

export default SpotifyError;
