import Image from "next/image";
import React, { useState } from "react";

import styles from "./RecommendedArtists.module.scss";

type ArtistCardProps = {
  artist: SpotifyApi.ArtistObjectFull;
  onClickFollow: (id: string) => void;
};

const ArtistCard = (props: ArtistCardProps) => {
  const { artist, onClickFollow } = props;

  const [isHover, setIsHover] = useState<boolean>(false);

  return (
    <div
      key={artist.id}
      className={styles.recommendedArtist}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
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
      {!isHover && <h3 className={styles.name}>{artist.name}</h3>}
      {isHover && (
        <button
          className={styles.followButton}
          onClick={() => onClickFollow(artist.id)}
        >
          Follow
        </button>
      )}
    </div>
  );
};

export default ArtistCard;
