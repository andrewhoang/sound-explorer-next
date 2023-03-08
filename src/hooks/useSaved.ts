import { useCallback } from "react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useEffect } from "react";
import useSpotify from "@/hooks/useSpotify";

const useSaved = (id: string) => {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();

  const [isSaved, setIsSaved] = useState<boolean>(false);

  const checkIsSaved = useCallback(async () => {
    spotifyApi.containsMySavedTracks([id]).then((data) => {
      if (data.body[0]) {
        setIsSaved(true);
      } else {
        setIsSaved(false);
      }
    });
  }, [id, spotifyApi]);

  const saveToLibrary = useCallback(async () => {
    spotifyApi
      .addToMySavedTracks([id])
      .then((data) => {
        console.log("successfully saved");
        setIsSaved(true);
      })
      .catch((err) => {
        console.log("something went wrong", err);
      });
  }, [id, spotifyApi]);

  const removeFromLibrary = useCallback(async () => {
    spotifyApi
      .removeFromMySavedTracks([id])
      .then((data) => {
        console.log("successfully removed");
        setIsSaved(false);
      })
      .catch((err) => {
        console.log("something went wrong", err);
      });
  }, [id, spotifyApi]);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      checkIsSaved();
    }
  }, [session, spotifyApi, checkIsSaved]);

  return { isSaved, saveToLibrary, removeFromLibrary };
};

export default useSaved;
