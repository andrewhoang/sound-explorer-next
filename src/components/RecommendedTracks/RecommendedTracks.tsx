import { useCallback, useEffect, useState } from "react";

import styles from "./RecommendedTracks.module.scss";

import { useSession } from "next-auth/react";
import useSpotify from "@/hooks/useSpotify";

import TrackCard from "../TrackCard/TrackCard";

import * as R from "ramda";
import shuffle from "lodash.shuffle";
import useRecentlyPlayed from "@/hooks/useRecentlyPlayed";

const RecommendedTracks = (): JSX.Element => {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();

  const { recentlyPlayedTracks, recentlyPlayedArtists } = useRecentlyPlayed();

  const [recommendedTracks, setRecommendedTracks] = useState<
    SpotifyApi.RecommendationTrackObject[]
  >([]);

  const getRecommendedTracks = useCallback(async () => {
    const trackIds = recentlyPlayedTracks
      .map((item) => item.track.id)
      .slice(0, 2);
    const artistIds = recentlyPlayedArtists.map(
      (artist: SpotifyApi.ArtistObjectFull) => artist.id
    );

    if (!R.isEmpty(trackIds) && !R.isEmpty(artistIds)) {
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
    }
  }, [spotifyApi, recentlyPlayedArtists, recentlyPlayedTracks]);

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
