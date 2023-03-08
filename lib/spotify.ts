import SpotifyWebApi from "spotify-web-api-node";

const scope = [
  "playlist-modify-private",
  "playlist-modify-public",
  "playlist-read-private",
  "user-read-private",
  "user-read-email",
  "user-modify-playback-state",
  "user-read-playback-state",
  "user-top-read",
  "user-library-read",
  "user-follow-read",
  "ugc-image-upload",
  "user-read-recently-played",
  "user-library-modify",
].join(",");

const params = {
  scope,
};

const searchParams = new URLSearchParams(params);

export const LOGIN_URL = `https://accounts.spotify.com/authorize?${searchParams.toString()}`;

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

export const getArtistAlbums = (
  id: string,
  cb: (d: SpotifyApi.ArtistsAlbumsResponse) => void
) => {
  spotifyApi.getArtistAlbums(id).then((data) => cb(data.body));
};

export default spotifyApi;
