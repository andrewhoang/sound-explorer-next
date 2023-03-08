import Image from "next/image";
import React from "react";

import styles from "./Banner.module.scss";

import { BannerProps } from "./Banner.propTypes";

const Banner = (props: BannerProps) => {
  const { title, subtitle, image, buttons } = props;

  return (
    <div className={styles.banner}>
      {image && (
        <Image
          src={image.url}
          alt={title || ""}
          fill
          className={styles.imageBg}
          priority
        />
      )}
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {buttons && <div className={styles.cta}>{buttons}</div>}
      </div>
    </div>
  );
};

export default Banner;
