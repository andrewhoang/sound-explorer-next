import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import useSpotify from "@/hooks/useSpotify";

import shuffle from "lodash.shuffle";
import * as R from "ramda";

const useRecentlyPlayed = () => {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();

  const [recentlyPlayedTracks, setRecentlyPlayedTracks] = useState<
    SpotifyApi.PlayHistoryObject[]
  >([]);

  const [recentlyPlayedArtists, setRecentlyPlayedArtists] = useState<
    SpotifyApi.ArtistObjectFull[]
  >([]);

  const getRecentlyPlayed = useCallback(async () => {
    const recentlyPlayed = await spotifyApi
      .getMyRecentlyPlayedTracks({ limit: 20 })
      .then((data) => shuffle(data?.body?.items));

    setRecentlyPlayedTracks(recentlyPlayed);

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
  }, [spotifyApi]);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      getRecentlyPlayed();
    }
  }, [session, spotifyApi, getRecentlyPlayed]);

  return { recentlyPlayedTracks, recentlyPlayedArtists };
};

export default useRecentlyPlayed;
