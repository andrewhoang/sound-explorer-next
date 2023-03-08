import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useSpotify from "@/hooks/useSpotify";

import Image from "next/image";
import Layout from "@/components/Layout/Layout";
import Banner from "@/components/Banner/Banner";
import RelatedArtists from "@/components/RelatedArtists/RelatedArtists";
import Button from "@/components/Button/Button";

import styles from "@/styles/pages/Artists.module.scss";

import * as R from "ramda";
import cn from "classnames";

const Search = () => {
  const router = useRouter();
  const spotifyApi = useSpotify();
  const { data: session } = useSession();

  const { param } = router.query;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [baseArtist, setBaseArtist] = useState<SpotifyApi.ArtistObjectFull>();
  const [relatedArtists, setRelatedArtists] = useState<
    SpotifyApi.ArtistObjectFull[]
  >([]);
  const [selectedArtists, setSelectedArtists] = useState<
    SpotifyApi.ArtistObjectFull[]
  >([]);

  const getRelatedArtists = useCallback(async () => {
    await spotifyApi
      .getArtist(`${param}`)
      .then((data) => setBaseArtist(data.body));

    await spotifyApi
      .getArtistRelatedArtists(`${param}`)
      .then((data) => setRelatedArtists(data.body.artists));
  }, [spotifyApi, param]);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      getRelatedArtists();
    }
  }, [session, spotifyApi, getRelatedArtists]);

  const handleSelectArtist = (artist: SpotifyApi.ArtistObjectFull) => {
    setSelectedArtists((prevState) => [...prevState, artist]);

    spotifyApi.getArtistRelatedArtists(artist.id).then((data) => {
      setRelatedArtists((prevState) => [...prevState, ...data.body.artists]);
    });
  };

  const handleDeselectArtist = (artist: SpotifyApi.ArtistObjectFull) => {
    setSelectedArtists((prevState) => [
      ...prevState.filter((s) => s.id !== artist.id),
    ]);
  };

  const handleCreatePlaylist = () => {
    setIsLoading(true);
    router.push(
      {
        pathname: "/playlist",
        query: {
          selected: [
            baseArtist ? baseArtist.name : "",
            ...selectedArtists.map((s) => s.name),
          ],
          type: "artist",
        },
      },
      "/playlist"
    );
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const filteredArtists = R.uniqBy(
    R.prop("id"),
    relatedArtists.filter(
      (artist) => !selectedArtists.find((selected) => selected.id === artist.id)
    )
  );

  return (
    <Layout title={`Sound Explorer - ${baseArtist?.name}`}>
      <Banner
        title={baseArtist?.name}
        subtitle={baseArtist?.genres.slice(0, 3).join(", ")}
        image={baseArtist?.images[0]}
        buttons={[
          <Button
            key={0}
            as="button"
            className={styles.btn}
            onClick={handleCreatePlaylist}
          >
            {isLoading ? "Creating New Playlist..." : "Create Playlist"}
          </Button>,
        ]}
      />
      <div className={styles.content}>
        <h2 className={styles.title}>Personalize your sound</h2>
        <p className={styles.subtitle}>
          Select artists related to the ones you like.
        </p>
        <div className={styles.selectedArtistsList}>
          {selectedArtists?.map((artist, index) => (
            <button
              className={styles.selectedArtist}
              key={index}
              onClick={() => handleDeselectArtist(artist)}
            >
              <Image
                className={styles.selectedArtistImage}
                src={artist.images[2].url}
                alt={artist.name}
                height={artist.images[2].height}
                width={artist.images[2].width}
                title={artist.name}
              />
            </button>
          ))}
        </div>
        <RelatedArtists
          artists={filteredArtists}
          onSelectArtist={handleSelectArtist}
        />
        <div className={styles.footer}>
          <Button
            as="button"
            className={styles.btn}
            onClick={handleCreatePlaylist}
          >
            {isLoading ? "Creating New Playlist..." : "Create Playlist"}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
