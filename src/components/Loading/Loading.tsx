import { PropsWithChildren } from "react";

import { LoadingProps } from "./Loading.props";

import styles from "./Loading.module.scss";

const Loading = (props: PropsWithChildren<LoadingProps>): JSX.Element => {
  const { rendered, children } = props;

  return !rendered ? (
    <div className={styles.loading}>
      <div className={styles.wave}></div>
      <div className={styles.wave}></div>
      <div className={styles.wave}></div>
      <div className={styles.wave}></div>
      <div className={styles.wave}></div>
    </div>
  ) : (
    <>{children}</>
  );
};

export default Loading;
