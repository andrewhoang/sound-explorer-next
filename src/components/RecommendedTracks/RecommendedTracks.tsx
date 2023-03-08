import { useCallback, useEffect, useState } from "react";

import styles from "./RecommendedTracks.module.scss";

import { useSession } from "next-auth/react";
import useSpotify from "@/hooks/useSpotify";

import TrackCard from "../TrackCard/TrackCard";

import * as R from "ramda";
import shuffle from "lodash.shuffle";

const RecommendedTracks = (): JSX.Element => {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();

  const [recommendedTracks, setRecommendedTracks] = useState<
    SpotifyApi.RecommendationTrackObject[]
  >([]);

  const [recentlyPlayedArtists, setRecentlyPlayedArtists] = useState<
    SpotifyApi.ArtistObjectFull[]
  >([]);

  const getRecommendedTracks = useCallback(async () => {
    const recentlyPlayed = await spotifyApi
      .getMyRecentlyPlayedTracks({ limit: 20 })
      .then((data) => shuffle(data?.body?.items));

    // Get random last 3 artists user listened to based on recently played
    // @ts-ignore
    const recentlyPlayedArtists = R.compose(
      R.slice(0, 3),
      // @ts-ignore
      (arr) => shuffle(arr),
      R.uniqBy(R.prop("id")),
      // @ts-ignore
      R.map(R.compose(R.view(R.lensIndex(0)), R.path(["track", "artists"])))
    )(recentlyPlayed) as SpotifyApi.ArtistObjectFull[];

    setRecentlyPlayedArtists(recentlyPlayedArtists);

    const trackIds = recentlyPlayed.map((item) => item.track.id).slice(0, 2);
    const artistIds = recentlyPlayedArtists.map(
      (artist: SpotifyApi.ArtistObjectFull) => artist.id
    );

    const recommendedTracks = await spotifyApi
      .getRecommendations({
        seed_artists: artistIds,
        seed_tracks: trackIds,
        limit: 10,
      })
      .then((data) => data.body.tracks);

    setRecommendedTracks(
      recommendedTracks as SpotifyApi.RecommendationTrackObject[]
    );
  }, [spotifyApi]);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      getRecommendedTracks();
    }
  }, [session, spotifyApi, getRecommendedTracks]);

  return (
    <div className={styles.recommendedTracks}>
      <h2 className={styles.title}>Recommended Tracks</h2>
      <p>
        Because you listen to{" "}
        {recentlyPlayedArtists.map((artist) => artist.name).join(", ")}
      </p>
      <div className={styles.recommendedTracksList}>
        {recommendedTracks?.map((track) => (
          <TrackCard
            key={track.id}
            id={track.id}
            image={track.album.images[1]}
            name={track.name}
            artists={track.artists.map((artist) => artist?.name).join(", ")}
          />
        ))}
      </div>
    </div>
  );
};

export default RecommendedTracks;
