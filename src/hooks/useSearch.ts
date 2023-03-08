import { useState, useEffect, useCallback } from "react";
import useSpotify from "@/hooks/useSpotify";

import * as R from "ramda";
import minBy from "lodash.minby";

type SearchResults = {
  artists?: SearchResult[];
  tracks?: SearchResult[];
};

type SearchResult = {
  type: string;
  id: string;
  title: string;
  image?: SpotifyApi.ImageObject;
  description: string;
};

const useSearch = () => {
  const spotifyApi = useSpotify();

  const [results, setResults] = useState<SearchResults>({});
  const [search, setSearch] = useState<string>("");

  const getArtistResults = useCallback(async () => {
    if (search) {
      const resultArtists = await spotifyApi
        .searchArtists(search, { limit: 10 })
        .then((data) => data.body.artists?.items);

      const artists = R.compose(
        R.uniqBy(R.prop("title")),
        R.map((artist: SpotifyApi.ArtistObjectFull) => ({
          type: "artist",
          id: artist.id,
          title: artist.name,
          image: minBy(artist.images, "height"),
          description: artist.genres.slice(0, 3).join(", "),
        })),
        R.defaultTo([])
      )(resultArtists);

      setResults((prevState) => ({ ...prevState, artists }));
    } else {
      setResults((prevState) => ({ ...prevState, artists: [] }));
    }
  }, [search, spotifyApi]);

  const getTrackResults = useCallback(async () => {
    if (search) {
      const resultTracks = await spotifyApi
        .searchTracks(search, { limit: 10 })
        .then((data) => data.body.tracks?.items);

      const tracks = R.compose(
        R.uniqBy(R.prop("title")),
        R.map((track: SpotifyApi.TrackObjectFull) => ({
          type: "track",
          id: track.id,
          title: track.name,
          image: minBy(track.album.images, "height"),
          description: track.artists.map((artist) => artist.name).join(", "),
        })),
        R.defaultTo([])
      )(resultTracks);

      setResults((prevState) => ({ ...prevState, tracks }));
    } else {
      setResults((prevState) => ({ ...prevState, tracks: [] }));
    }
  }, [search, spotifyApi]);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      getArtistResults();
      getTrackResults();
    }
  }, [search, spotifyApi, getArtistResults, getTrackResults]);

  return { results, search, setSearch };
};

export default useSearch;
