import { useContext, useEffect, useState } from "react";
import Head from "next/head";
import { LayoutProps } from "./Layout.props";
import { ThemeContext } from "@/context/ThemeContext";

import Loading from "../Loading/Loading";

const Layout = (props: LayoutProps): JSX.Element => {
  const { title, children } = props;

  const [rendered, setRendered] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => setRendered(true), 3000);
  }, []);

  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    document.body.className = `theme--${theme}`;
  }, [theme]);

  return (
    <Loading rendered={rendered}>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Explore new sound" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>{children}</main>
    </Loading>
  );
};

export default Layout;
