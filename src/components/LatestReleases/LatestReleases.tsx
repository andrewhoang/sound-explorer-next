import { useState, useEffect, useCallback } from "react";
import useSpotify from "@/hooks/useSpotify";
import { useSession } from "next-auth/react";

import styles from "./LatestReleases.module.scss";

import TrackCard from "../TrackCard/TrackCard";

import { subMonths, isAfter } from "date-fns";
import * as R from "ramda";
import cn from "classnames";
import RecommendedArtists from "../RecommendedArtists/RecommendedArtists";

const LatestReleases = (): JSX.Element => {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();

  const [latestReleases, setLatestReleases] = useState<
    SpotifyApi.TrackObjectFull[]
  >([]);

  const getLatestReleases = useCallback(async () => {
    const followedArtists = await spotifyApi
      .getFollowedArtists({ limit: 50 })
      .then((data) => data?.body?.artists?.items);

    const albums = followedArtists.map(async (artist) => {
      return await spotifyApi.getArtistAlbums(artist?.id).then((data) => {
        let monthOld = subMonths(new Date(), 1);
        let recentAlbums = data?.body?.items
          ?.filter((album) => isAfter(new Date(album.release_date), monthOld))
          .map(
            async (album) =>
              await spotifyApi
                .getAlbumTracks(album.id, { limit: 1 })
                .then((data) => {
                  return { ...data.body.items[0], album };
                })
          );

        return Promise.all(recentAlbums);
      });
    });

    const results = await Promise.all(albums.map((p) => p.catch((e) => e)));

    const cleanResults = R.compose(
      // @ts-ignore
      R.sort(R.descend(R.path(["album", "release_date"]))),
      R.uniqBy(R.prop("name")),
      R.uniqBy(R.prop("id")),
      R.defaultTo([]),
      R.flatten
    )(results);

    setLatestReleases(cleanResults as SpotifyApi.TrackObjectFull[]);
  }, [spotifyApi]);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      getLatestReleases();
    }
  }, [session, spotifyApi, getLatestReleases]);

  const noReleases = R.isEmpty(latestReleases);

  return (
    <div className={styles.latestReleases}>
      {!noReleases && (
        <RecommendedArtists className={styles.hasReleases} itemsToShow={4} />
      )}
      <h2 className={styles.title}>Latest Releases</h2>
      <p>Based on artists you follow</p>
      <div
        className={cn(styles.latestReleasesList, {
          [styles.emptyList]: noReleases,
        })}
      >
        {!noReleases ? (
          latestReleases
            ?.slice(0, 20)
            ?.map((release) => (
              <TrackCard
                id={release.id}
                key={release.id}
                image={release.album.images[1]}
                name={release.name}
                artists={release.artists
                  .map((artist) => artist?.name)
                  .join(", ")}
              />
            ))
        ) : (
          <h3>No new releases</h3>
        )}
      </div>
      {noReleases && <RecommendedArtists />}
    </div>
  );
};

export default LatestReleases;
