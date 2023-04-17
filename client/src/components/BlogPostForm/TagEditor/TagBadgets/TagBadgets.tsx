import Link from "next/link";

import styles from "./TagBadgets.module.scss";

export default function TagBadgets({ tags }: { tags: string[] }) {
  return (
    <div className={styles.container}>
      <div className={styles.badgets}>
        {tags.map((tagName, index) => {
          return (
            <Link
              className={styles.badget}
              href={`/blog?tags=${tagName}`}
              key={index}
            >
              <span key={index}>
                { tagName }
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
