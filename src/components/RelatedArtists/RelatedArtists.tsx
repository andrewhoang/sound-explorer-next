import { RelatedArtistsProps } from "./RelatedArtists.props";

import styles from "./RelatedArtists.module.scss";
import ArtistCard from "../ArtistCard/ArtistCard";

const RelatedArtists = (props: RelatedArtistsProps): JSX.Element => {
  const { artists, onSelectArtist } = props;

  return (
    <div className={styles.relatedArtists}>
      <div className={styles.relatedArtistsList}>
        {artists?.map((artist, index) => (
          <ArtistCard
            key={index}
            artist={artist}
            onSelectArtist={onSelectArtist}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedArtists;
