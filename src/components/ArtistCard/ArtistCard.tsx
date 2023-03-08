import Image from "next/image";
import { ArtistCardProps } from "./ArtistCard.props";

import styles from "./ArtistCard.module.scss";

const ArtistCard = (props: ArtistCardProps) => {
  const { artist, onSelectArtist } = props;

  return (
    <button
      className={styles.artistCard}
      onClick={() => onSelectArtist(artist)}
    >
      <Image
        src={artist.images[0].url}
        alt={artist.name}
        fill
        sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
        loading="lazy"
      />
      <h2 className={styles.name}>{artist.name}</h2>
    </button>
  );
};

export default ArtistCard;
