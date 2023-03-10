import { BannerProps } from "./Banner.propTypes";

import styles from "./Banner.module.scss";

import Image from "next/image";

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
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>{title}</h1>
        </div>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {buttons && <div className={styles.cta}>{buttons}</div>}
      </div>
    </div>
  );
};

export default Banner;
