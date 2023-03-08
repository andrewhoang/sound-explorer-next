import { useState, useEffect, useRef, useContext } from "react";
import { HeroProps } from "./Hero.propTypes";

import styles from "./Hero.module.scss";
import Searchbar from "../Searchbar/Searchbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faMoon,
  // faSunBright,
} from "@fortawesome/free-solid-svg-icons";
import { faSun } from "@fortawesome/free-regular-svg-icons";
import { ThemeContext } from "@/context/ThemeContext";

const Hero = (props: HeroProps) => {
  const { title, onClickScroll } = props;

  const { theme, setTheme } = useContext(ThemeContext);

  const [searchWidth, setSearchWidth] = useState<number>(0);

  const titleRef = useRef<HTMLHeadingElement>(null);

  const constrainSearchWidth = () => {
    setSearchWidth(titleRef.current?.clientWidth || 0);
  };

  useEffect(() => {
    constrainSearchWidth();

    window.addEventListener("resize", constrainSearchWidth);

    return () => {
      window.removeEventListener("resize", constrainSearchWidth);
    };
  }, [titleRef]);

  return (
    <div className={styles.hero}>
      <h1 ref={titleRef} className={styles.title}>
        {title}
      </h1>
      <Searchbar
        placeholder="Search by favorite artist or track"
        width={searchWidth}
      />
      <button
        className={styles.themeToggle}
        aria-label="Toggle theme"
        onClick={setTheme}
      >
        <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} />
      </button>
      <button
        className={styles.scrollToContent}
        aria-label="Scroll to content"
        onClick={onClickScroll}
      >
        <FontAwesomeIcon icon={faChevronDown} />
      </button>
    </div>
  );
};

export default Hero;
