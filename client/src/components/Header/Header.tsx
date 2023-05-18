import Image from "next/image";
import Link from "next/link";

import { useAuthProvider } from "@providers/AuthProvider";

import styles from "./Header.module.scss";

interface HeaderProps {
  children?: JSX.Element;
  height?: number;
}

export default function Header({ children, height }: HeaderProps) {
  const authStatus = useAuthProvider();

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

          { authStatus?.isLogged &&
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
