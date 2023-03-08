import { useCallback, useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useSpotify from "@/hooks/useSpotify";

import Playlist from "@/components/Playlist/Playlist";
import Layout from "@/components/Layout/Layout";
import Banner from "@/components/Banner/Banner";
import Link from "next/link";

import styles from "@/styles/pages/Playlist.module.scss";

import * as R from "ramda";
import uniqBy from "lodash.uniqby";
import shuffle from "lodash.shuffle";
import Button from "@/components/Button/Button";
import usePlaylistInfo from "@/hooks/usePlaylist";
import Modal from "@/components/Modal/Modal";
import PlaylistCard from "@/components/PlaylistCard/PlaylistCard";

const PLAYLIST_SIZE = 20;

const PlaylistPage = () => {
  const router = useRouter();
  const spotifyApi = useSpotify();
  const { playlists } = usePlaylistInfo();
  const { data: session } = useSession();

  const { selected, type } = router.query;

  const [queue, setQueue] = useState<SpotifyApi.TrackObjectFull[]>([]);
  const [playlist, setPlaylist] = useState<SpotifyApi.TrackObjectFull[]>([]);
  const [playlistName, setPlaylistName] = useState<string>("");
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setPlaylistName(`${session?.user?.name?.split(" ")[0]}'s Playlist`);

    if (R.isEmpty(playlist) && R.isEmpty(router.query)) {
      router.push("/");
    }
  }, [session, playlist, router]);

  const buildPlaylist = useCallback(async () => {
    if (type === "artist") {
      const ids = Array.isArray(selected) ? selected : [selected];

      // For each artist, search
      const tracks = await Promise.all(
        ids?.map((artist) =>
          spotifyApi
            .searchTracks(`${type}:${artist}`, { limit: 50, market: "US" })
            .then((data) => {
              const items = data.body.tracks?.items ?? [];

              const filteredTracks = items?.filter((track) => {
                if (track.artists.find((a) => a.name === artist)) {
                  return track;
                }
              });

              return filteredTracks;
            })
        )
      );

      const uniqTracks = uniqBy(R.flatten(tracks), (t) =>
        [t?.name, t?.artists[0].name.toLowerCase()].join()
      );

      const playlist = shuffle(uniqTracks).slice(0, PLAYLIST_SIZE);

      const filteredQueue = uniqTracks.filter(
        (track) => !playlist.find((p) => p.id === track.id)
      );

      setQueue(filteredQueue);
      setPlaylist(playlist);
    }

    if (type === "track") {
      const trackId = `${selected}`;

      const track = await spotifyApi
        .getTrack(trackId)
        .then((data) => data.body);

      const audioFeatures = await spotifyApi
        .getAudioFeaturesForTrack(trackId)
        .then((data) => data.body);

      const tracks = (await spotifyApi
        .getRecommendations({
          seed_artists: track.artists[0]?.id,
          seed_tracks: track?.id,
          target_danceability: audioFeatures?.danceability,
          target_energy: audioFeatures?.energy,
          limit: 50,
          market: "US",
        })
        .then((data) => data.body.tracks)) as SpotifyApi.TrackObjectFull[];

      const uniqTracks = uniqBy([track, ...shuffle(R.flatten(tracks))], (t) =>
        [t?.name, t?.artists[0].name.toLowerCase()].join()
      );

      const playlist = uniqTracks.slice(0, PLAYLIST_SIZE);

      const filteredQueue = uniqTracks.filter(
        (track) => !playlist.find((p) => p.id === track.id)
      );

      setQueue(filteredQueue);
      setPlaylist(playlist);
    }
  }, [type, spotifyApi, selected]);

  const handleCreatePlaylist = () => {
    spotifyApi.createPlaylist(playlistName, { public: true }).then(
      (data) =>
        spotifyApi
          .addTracksToPlaylist(
            data.body.id,
            playlist.map((track) => track.uri)
          )
          .then(
            (data) => console.log("Successfully created new playlist!"),
            (err) => console.log("Something went wrong!", err)
          ),
      (err) => console.log("Something went wrong!", err)
    );
  };

  const handleDisplayPlaylists = () => {
    setModalIsOpen(true);
  };

  const [addingTrack, setAddingTrack] = useState<string>("");

  const handleAddTrackToPlaylist = (id: string) => {
    setAddingTrack(id);
    setModalIsOpen(true);
  };

  const handleAddToPlaylist = (id: string) => {
    spotifyApi
      .addTracksToPlaylist(
        id,
        addingTrack ? [addingTrack] : playlist.map((track) => track.uri)
      )
      .then(
        (data) => {
          console.log("Added tracks to playlist!");
          setModalIsOpen(false);
          setAddingTrack("");
        },
        (err) => {
          console.log("Something went wrong!", err);
          setModalIsOpen(false);
          setAddingTrack("");
        }
      );
  };

  const handleRemoveTrack = (id: string) => {
    const trackIdx = R.findIndex(R.propEq("id", id), playlist);

    // Pull new track from queue
    const newTrack = shuffle(queue).slice(0, 1);

    const trackToRemove = playlist[trackIdx];

    setQueue([
      ...queue.filter((track) => track.id !== newTrack[0].id),
      trackToRemove,
    ]);

    playlist[trackIdx] = newTrack[0];

    setPlaylist([...playlist]);
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      buildPlaylist();
    }
  }, [session, spotifyApi, buildPlaylist]);

  const playlistProps = {
    tracks: playlist,
    onClickAdd: handleAddTrackToPlaylist,
    onClickRemove: handleRemoveTrack,
  };

  return (
    <Layout title="Sound Explorer">
      <Banner
        title={playlistName}
        image={playlist[0]?.album.images[0]}
        buttons={[
          <Button
            key={0}
            as="button"
            className={styles.btn}
            onClick={handleCreatePlaylist}
          >
            Create Playlist
          </Button>,
          <Button
            key={1}
            as="button"
            className={styles.btn}
            onClick={handleDisplayPlaylists}
          >
            Add to Playlist
          </Button>,
        ]}
      />
      <Playlist {...playlistProps} />
      <div className={styles.footer}>
        <Link href="/" className={styles.button}>
          Back to Home
        </Link>
      </div>
      <Modal
        title="Add to Playlist"
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
      >
        <div className={styles.playlistList}>
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              onSelectPlaylist={handleAddToPlaylist}
            />
          ))}
        </div>
      </Modal>
    </Layout>
  );
};

export default PlaylistPage;
