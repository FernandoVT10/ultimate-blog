import Link from "next/link";

import { useAuthProvider } from "@providers/AuthProvider";

import styles from "./Navbar.module.scss";

export default function Navbar() {
  const authStatus = useAuthProvider();

  return (
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

        { authStatus?.isLogged &&
          <li className={styles.menuItem}>
            <Link href="/blog/createPost" className={styles.link}>
              Create Post
            </Link>
          </li>
        }
      </ul>
    </nav>
  );
}
