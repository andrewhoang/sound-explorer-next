import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

import styles from "./User.module.scss";

import cn from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import spotifyApi from "../../../lib/spotify";

const User = (): JSX.Element => {
  const { data: session } = useSession();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const logout = () => {
    signOut();
  };

  return (
    <div className={styles.user}>
      <button className={styles.userButton} onClick={() => setIsOpen(!isOpen)}>
        {session?.user?.image && (
          <Image src={session?.user?.image} height={30} width={30} alt="User" />
        )}
        <span className={styles.username}>{session?.user?.name}</span>
        <FontAwesomeIcon icon={isOpen ? faCaretUp : faCaretDown} />
      </button>
      {isOpen && (
        <div className={cn(styles.userDropdown, { [styles.isOpen]: isOpen })}>
          <button className={styles.logout} onClick={logout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default User;
