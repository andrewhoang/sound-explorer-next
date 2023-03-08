import Image from "next/image";

import { PlaylistCardProps } from "./PlaylistCard.props";

import styles from "./PlaylistCard.module.scss";

const PlaylistCard = (props: PlaylistCardProps): JSX.Element => {
  const { playlist, onSelectPlaylist } = props;

  return (
    <button
      className={styles.playlistCard}
      onClick={() => onSelectPlaylist(playlist.id)}
    >
      {playlist.images[0].url && (
        <Image
          src={playlist.images[0].url}
          alt={playlist.name}
          fill
          sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
          loading="lazy"
        />
      )}
      <h2 className={styles.name}>{playlist.name}</h2>
    </button>
  );
};

export default PlaylistCard;
