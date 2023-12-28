import Image from "next/image";
import Navbar from "@components/Navbar";

import styles from "./Header.module.scss";

interface HeaderProps {
  children?: JSX.Element;
  height?: number;
}

export default function Header({ children, height }: HeaderProps) {
  return (
    <header className={styles.header} style={{ height: height || 50 }}>
      <Navbar/>

      <Image
        src="/images/header-bg.webp"
        alt="Header Image"
        className={styles.bg}
        priority
        fill
      />

      <div className={styles.children}>
        { children }
      </div>
    </header>
  );
}
