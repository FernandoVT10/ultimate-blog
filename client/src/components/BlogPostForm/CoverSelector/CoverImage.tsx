import Image from "next/image";

import styles from "./CoverSelector.module.scss";

export default function CoverImage({ coverURL }: { coverURL?: string }) {
  if(!coverURL) return null;

  return (
    <div className={styles.cover}>
      <Image
        className={styles.coverImage}
        src={coverURL}
        alt="Post cover"
        fill
        sizes="(max-width: 1200px) 100vw, 1200px"
        priority
      />
    </div>
  );
}
