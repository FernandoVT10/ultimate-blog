import Link from "next/link";
import Image from "next/image";
import Canvas from "./Canvas";
import Navbar from "@components/Navbar/Navbar";

import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";

import styles from "./MainScreen.module.scss";

const description = `\
Hi, I'm a Javascript full stack developer.
I like video games, anime, music, and trying to find the best way to write the cleanest and best code.
`;

export default function MainScreen() {
  return (
    <header className={styles.mainScreen}>
      <Navbar/>

      <div className={styles.profileDescription}>
        <h1 className={styles.fullName}>{"Fernando Vaca Tamayo"}</h1>

        <hr className={styles.separator}/>

        <p className={styles.description}>
          {description}
        </p>

        <ul className={styles.socialMediaList}>
          <li className={styles.socialMediaItem}>
            <Link href="https://twitter.com/FernandoVT10" target="_blank">
              <FaTwitter className={styles.icon}/>
            </Link>
          </li>

          <span className={styles.line}></span>

          <li className={styles.socialMediaItem}>
            <Link href="https://github.com/FernandoVT10" target="_blank">
              <FaGithub className={styles.icon}/>
            </Link>
          </li>

          <span className={styles.line}></span>

          <li className={styles.socialMediaItem}>
            <Link href="https://linkedin.com/in/fernandovacatamayo/" target="_blank">
              <FaLinkedin className={styles.icon}/>
            </Link>
          </li>

          <span className={styles.line}></span>

          <li className={styles.socialMediaItem}>
            <Link href="/blog">
              {"My Blog"}
            </Link>
          </li>
        </ul>
      </div>

      <Image
        src="/images/header-bg.webp"
        alt="Header Image"
        className={styles.bg}
        priority
        fill
      />

      <Canvas/>
    </header>
  );
}
