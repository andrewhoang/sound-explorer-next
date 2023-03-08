export type RelatedArtistsProps = {
  artists: SpotifyApi.ArtistObjectFull[];
  onSelectArtist: (artist: SpotifyApi.ArtistObjectFull) => void;
};
