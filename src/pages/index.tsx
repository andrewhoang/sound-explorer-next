import { useRef } from "react";

import styles from "@/styles/pages/Home.module.scss";

import Layout from "@/components/Layout/Layout";
import Banner from "@/components/Hero/Hero";
import LatestReleases from "@/components/LatestReleases/LatestReleases";
import RecommendedTracks from "@/components/RecommendedTracks/RecommendedTracks";
import User from "@/components/User/User";
import RecommendedArtists from "@/components/RecommendedArtists/RecommendedArtists";

const Home = (): JSX.Element => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    contentRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Layout title="Sound Explorer - Home">
      <User />
      <Banner title="Discover New Sound" onClickScroll={handleScroll} />
      <div className={styles.content} ref={contentRef}>
        <LatestReleases />
        <RecommendedTracks />
      </div>
    </Layout>
  );
};

export default Home;
