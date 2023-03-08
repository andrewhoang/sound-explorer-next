import { useState, useEffect } from "react";

/**
 * useMatchMedia
 *
 * usage:
 *   const matches = useMatchMedia("(min-width: 900px)")
 *   matches will be true or false
 *
 * the format of the string is important, eg, needs ()'s
 * see https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
 * @param  {String} media : media query to match
 * @return {Boolean} true if it matches, false if it doesn't
 */
export default function useMatchMedia(media: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  // define mediaQueryList inside effect because of server rendering/hydration
  // https://github.com/gatsbyjs/gatsby/issues/14601
  // we need to render again when the client loads
  useEffect(() => {
    const mediaQueryList = window.matchMedia(media);
    setMatches(mediaQueryList.matches);

    const handleMatchChange = (event: MediaQueryListEvent) =>
      setMatches(event.matches);
    mediaQueryList.addEventListener("change", handleMatchChange);
    return () =>
      mediaQueryList.removeEventListener("change", handleMatchChange);
  }, [media]);

  return matches;
}
