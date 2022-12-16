import Link from "next/link";
import styles from "./Navbar.module.scss";

export default function Navbar() {
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

        <li className={styles.menuItem}>
          <Link href="/#contact-me" className={styles.link}>
            Contact Me
          </Link>
        </li>
      </ul>
    </nav>
  );
}
