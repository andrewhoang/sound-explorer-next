import { useCallback, useEffect, useState } from "react";
import useRecentlyPlayed from "@/hooks/useRecentlyPlayed";
import useSpotify from "@/hooks/useSpotify";
import { useSession } from "next-auth/react";

import styles from "./RecommendedArtists.module.scss";

import ArtistCard from "@/components/RecommendedArtists/ArtistCard";

import * as R from "ramda";
import shuffle from "lodash.shuffle";
import cn from "classnames";

type RecommendedArtistsProps = {
  className?: string;
  itemsToShow: number;
};

const defaultProps = {
  itemsToShow: 12,
};

/**
 * Recommended user artists if they aren't following any
 * @returns
 */
const RecommendedArtists = (props: RecommendedArtistsProps): JSX.Element => {
  const { itemsToShow, className } = props;
  const spotifyApi = useSpotify();
  const { data: session } = useSession();

  const { recentlyPlayedArtists } = useRecentlyPlayed();

  const [recommendedArtists, setRecommendedArtists] = useState<
    SpotifyApi.ArtistObjectFull[]
  >([]);

  const getRelatedArtists = useCallback(async () => {
    const relatedArtists = recentlyPlayedArtists.map(async (artist) => {
      return await spotifyApi
        .getArtistRelatedArtists(artist.id)
        .then((data) => data.body.artists);
    });

    const results = await Promise.all(
      relatedArtists.map((p) => p.catch((e) => e))
    );

    const flatResults = R.flatten(results).slice(0, 50);

    if (!R.isEmpty(flatResults)) {
      // Filter out artists user is already following
      const filteredArtists = await spotifyApi
        .isFollowingArtists(flatResults.map((r) => r.id))
        .then((data) => {
          const isFollowing = data.body;

          return flatResults.filter((r, index) => !isFollowing[index]);
        });

      const uniqArtists = R.compose(
        // @ts-ignore
        shuffle,
        R.uniqBy(R.prop("name"))
      )(filteredArtists);

      // @ts-ignore
      setRecommendedArtists(uniqArtists);
    }
  }, [spotifyApi, recentlyPlayedArtists]);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      getRelatedArtists();
    }
  }, [session, spotifyApi, getRelatedArtists]);

  const handleFollowArtist = (id: string) => {
    spotifyApi.followArtists([id]).then((data) => {
      setRecommendedArtists(recommendedArtists.filter((ra) => ra.id !== id));
    });
  };

  return (
    <div className={cn(styles.recommendedArtists, className)}>
      <h2 className={styles.title}>Recommended Artists</h2>
      <p>
        Follow some of your favorite artists to keep up to date with their
        latest releases
      </p>
      <div className={styles.recommendedArtistsList}>
        {recommendedArtists.slice(0, itemsToShow).map((artist) => (
          <ArtistCard
            key={artist.id}
            artist={artist}
            onClickFollow={handleFollowArtist}
          />
        ))}
      </div>
    </div>
  );
};

RecommendedArtists.defaultProps = defaultProps;

export default RecommendedArtists;
