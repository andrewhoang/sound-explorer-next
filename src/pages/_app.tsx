import { useEffect, useState } from "react";

import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { defaultState, ThemeContext } from "@/context/ThemeContext";

import "@/styles/index.scss";

const App = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps): JSX.Element => {
  const [theme, setTheme] = useState<string>(defaultState?.theme);

  const updateTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    localStorage.setItem("theme", theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme) {
      setTheme(theme);
    }
  }, [setTheme]);

  return (
    <SessionProvider session={session} refetchOnWindowFocus={false}>
      <ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>
        <Component {...pageProps} />
      </ThemeContext.Provider>
    </SessionProvider>
  );
};

export default App;
