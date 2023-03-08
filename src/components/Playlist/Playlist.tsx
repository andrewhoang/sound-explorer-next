import styles from "./Playlist.module.scss";

import useMatchMedia from "@/hooks/useMatchMedia";

import DesktopPlaylist from "./DesktopPlaylist";
import MobileTrackCard from "./MobileTrackCard";

type PlaylistProps = {
  tracks: SpotifyApi.TrackObjectFull[];
  onClickAdd: (id: string) => void;
  onClickRemove: (id: string) => void;
};

const Playlist = (props: PlaylistProps): JSX.Element => {
  const { tracks, onClickAdd, onClickRemove } = props;

  const isLargeViewport = useMatchMedia("(min-width: 780px)");

  return (
    <div className={styles.playlist}>
      {isLargeViewport ? (
        <DesktopPlaylist
          tracks={tracks}
          onClickAdd={onClickAdd}
          onClickRemove={onClickRemove}
        />
      ) : (
        <div className={styles.mobilePlaylist}>
          {tracks.map((track) => (
            <MobileTrackCard
              key={track.id}
              track={track}
              onClickAdd={onClickAdd}
              onClickRemove={onClickRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Playlist;
