import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import spotifyApi from "../../lib/spotify";

const useSpotify = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      console.log("here");
      signIn();
    },
  });

  useEffect(() => {
    if (session) {
      spotifyApi.setAccessToken(session?.user?.accessToken);
    }
  }, [session]);

  return spotifyApi;
};

export default useSpotify;
