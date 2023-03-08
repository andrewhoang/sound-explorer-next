export type PlaylistCardProps = {
  playlist: SpotifyApi.PlaylistObjectSimplified;
  onSelectPlaylist: (id: string) => void;
};
