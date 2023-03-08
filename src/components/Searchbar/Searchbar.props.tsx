export type SearchbarProps = {
  label?: string;
  placeholder?: string;
  width?: number;
};

export type SearchResult = {
  type: string;
  id: string;
  title: string;
  image: SpotifyApi.ImageObject;
  description: string;
};
