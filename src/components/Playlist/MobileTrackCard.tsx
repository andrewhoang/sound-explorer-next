import Image from "next/image";

import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./MobileTrackCard.module.scss";

type MobileTrackCardProps = {
  track: SpotifyApi.TrackObjectFull;
  onClickAdd: (id: string) => void;
  onClickRemove: (id: string) => void;
};

const MobileTrackCard = (props: MobileTrackCardProps): JSX.Element => {
  const { track, onClickAdd, onClickRemove } = props;

  return (
    <div className={styles.mobileTrack}>
      <Image
        className={styles.trackAlbumImage}
        src={track.album.images[0].url}
        alt={track.name}
        width={track.album.images[0].width}
        height={track.album.images[0].height}
      />
      <div className={styles.trackInfo}>
        <strong className={styles.trackName}>{track.name}</strong>
        <p className={styles.trackArtist}>
          {" "}
          {track.artists
            .map((artist) => artist.name)
            .slice(0, 3)
            .join(", ")}
        </p>
      </div>
      <div className={styles.actions}>
        <button
          className={styles.trackAction}
          onClick={(e) => {
            e.preventDefault();
            onClickAdd(track.id);
          }}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
        <button
          className={styles.trackAction}
          onClick={(e) => {
            e.preventDefault();
            onClickRemove(track.id);
          }}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
};

export default MobileTrackCard;
