import { useEffect, useState } from "react";

import { checkAdminStatusFromClient } from "@services/AdminService";

import Image from "next/image";
import Link from "next/link";

import styles from "./Header.module.scss";

interface HeaderProps {
  children?: JSX.Element;
  height?: number;
}

export default function Header({ children, height }: HeaderProps) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // I think this is a bad thing to do,
      // it must be done from the server component (getServerSideProps),
      // but next js doesn't allow me to do it
      setIsAdmin(await checkAdminStatusFromClient());
    };

    fetchData();
  }, []);

  return (
    <header className={styles.header} style={{ height: height || 50 }}>
      <nav className={styles.navbar}>
        <ul className={styles.menu}>
          <li className={styles.menuItem}>
            <Link href="/" className={styles.link}>
              Home
            </Link>
          </li>

          <li className={styles.menuItem}>
            <Link href="/blog" className={styles.link}>
              Blog
            </Link>
          </li>

          <li className={styles.menuItem}>
            <Link href="/#contact-me" className={styles.link}>
              Contact Me
            </Link>
          </li>

          { isAdmin &&
            <li className={styles.menuItem}>
              <Link href="/blog/createPost" className={styles.link}>
                Create Post
              </Link>
            </li>
          }
        </ul>
      </nav>

      <Image
        src="/images/header-bg.jpg"
        alt="Header Image"
        className={styles.bg}
        fill
      />

      <div className={styles.children}>
        { children }
      </div>
    </header>
  );
}
