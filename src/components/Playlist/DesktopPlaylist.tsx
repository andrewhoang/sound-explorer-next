import { useMemo } from "react";
import styles from "./DesktopPlaylist.module.scss";

import Image from "next/image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

import cn from "classnames";
import { format } from "date-fns";

type DesktopPlaylistProps = {
  tracks: SpotifyApi.TrackObjectFull[];
  onClickAdd: (id: string) => void;
  onClickRemove: (id: string) => void;
};

const DesktopPlaylist = (props: DesktopPlaylistProps): JSX.Element => {
  const { tracks, onClickAdd, onClickRemove } = props;

  const columns = useMemo(
    () => [
      { key: "albumImage", label: "" },
      { key: "name", label: "Title" },
      { key: "artists", label: "Artists" },
      { key: "album", subkey: "name", label: "Album" },
      { key: "duration_ms", label: "Duration" },
      { key: "actions", label: "" },
    ],
    []
  );

  return (
    <div className={styles.table}>
      <div className={styles.tableHeader}>
        {columns.map((column) => {
          return (
            <div key={column.key} className={styles.columnCell}>
              {column.label}{" "}
            </div>
          );
        })}
      </div>

      <div className={styles.tableBody}>
        {tracks.map((track: SpotifyApi.TrackObjectFull) => {
          return (
            <div key={track.id} className={styles.tableRow}>
              <div className={styles.cell}>
                <Image
                  className={styles.trackAlbumImage}
                  src={track.album.images[2].url}
                  alt={track.name}
                  height={track.album.images[2].height}
                  width={track.album.images[2].width}
                />
              </div>
              <div className={styles.cell}>{track.name}</div>
              <div className={styles.cell}>
                {track.artists
                  .map((artist) => artist.name)
                  .slice(0, 3)
                  .join(", ")}
              </div>
              <div className={cn(styles.cell, styles.hiddenMobile)}>
                {track.album?.name}
              </div>
              <div className={cn(styles.cell, styles.hiddenMobile)}>
                {format(track.duration_ms, "m:ss")}
              </div>
              <div className={cn(styles.cell, styles.actions)}>
                <button
                  className={styles.cellBtn}
                  onClick={(e) => {
                    e.preventDefault();
                    onClickAdd(track.uri);
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
                <button
                  className={styles.cellBtn}
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
        })}
      </div>
    </div>
  );
};

export default DesktopPlaylist;
