import { GetServerSideProps } from "next";
import { getProviders, signIn } from "next-auth/react";
import { Poppins } from "next/font/google";

import styles from "@/styles/pages/Login.module.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";
import Layout from "@/components/Layout/Layout";
import Button from "@/components/Button/Button";

import cn from "classnames";

const inter = Poppins({ weight: ["800"], subsets: ["latin"] });

type LoginProps = {
  provider: {
    id: string;
  };
};

const Login = (props: LoginProps): JSX.Element => {
  const { provider } = props;

  return (
    <Layout title="Login">
      <div className={styles.login}>
        <div className={styles.container}>
          <sup className={styles.eyebrow}>Discover New Sound</sup>
          <h1 className={cn(styles.title, inter.className)}>
            Sound <FontAwesomeIcon icon={faRocket} /> Explorer
          </h1>
          <Button
            as="button"
            onClick={() => signIn(provider?.id, { callbackUrl: "/" })}
          >
            Sign In
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Login;

export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders();

  return {
    props: {
      provider: providers?.spotify,
    },
  };
};
