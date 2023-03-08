export type TrackCardProps = {
  id: string;
  image: {
    height?: number;
    width?: number;
    url: string;
  };
  name: string;
  artists: string;
};
