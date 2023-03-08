export type ArtistCardProps = {
  artist: SpotifyApi.ArtistObjectFull;
  onSelectArtist: (artist: SpotifyApi.ArtistObjectFull) => void;
};
