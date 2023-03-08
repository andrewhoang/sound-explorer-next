import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import useSpotify from "@/hooks/useSpotify";

const usePlaylistInfo = () => {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();

  const [playlists, setPlaylists] = useState<
    SpotifyApi.PlaylistObjectSimplified[]
  >([]);

  const getUserPlaylists = useCallback(async () => {
    await spotifyApi.getUserPlaylists(session?.user?.username).then(
      (data) => {
        const ownedPlaylists = data?.body?.items.filter(
          (playlist) => playlist.owner?.id === session?.user?.username
        );
        setPlaylists(ownedPlaylists);
      },
      (err) => {
        console.log("Something went wrong!", err);
      }
    );
  }, [session, spotifyApi]);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      getUserPlaylists();
    }
  }, [session, spotifyApi, getUserPlaylists]);

  return { playlists };
};

export default usePlaylistInfo;
