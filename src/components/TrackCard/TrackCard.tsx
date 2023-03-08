import Image from "next/image";

import { TrackCardProps } from "./TrackCard.props";

import useSaved from "@/hooks/useSaved";
import styles from "./TrackCard.module.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartEmpty } from "@fortawesome/free-regular-svg-icons";

const TrackCard = (props: TrackCardProps): JSX.Element => {
  const { id, image, name, artists } = props;

  const { isSaved, saveToLibrary, removeFromLibrary } = useSaved(id);

  return (
    <div className={styles.track}>
      <Image
        className={styles.trackAlbumImage}
        src={image.url}
        alt={name}
        width={image.width}
        height={image.height}
      />
      <div className={styles.trackInfo}>
        <strong className={styles.trackName}>{name}</strong>
        <p className={styles.trackArtist}>{artists}</p>
      </div>
      <div className={styles.actions}>
        <button
          className={styles.action}
          onClick={isSaved ? removeFromLibrary : saveToLibrary}
        >
          <FontAwesomeIcon icon={isSaved ? faHeart : faHeartEmpty} />
        </button>
      </div>
    </div>
  );
};

export default TrackCard;
