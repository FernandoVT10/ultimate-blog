import Link from "next/link";

import { TagIcon, PencilIcon } from "@primer/octicons-react";

import styles from "./TagsList.module.scss";

interface TagsListProps {
  tags: string[];
  showEditButton: boolean;
  showTagsModal: () => void;
}

export default function TagsList({ tags, showEditButton, showTagsModal }: TagsListProps) {
  if(!tags.length) {
    if(!showEditButton) return null;

    return (
      <button
        type="button"
        className="custom-btn"
        onClick={showTagsModal}
      >
        <TagIcon size={16} className="icon" />
        Add some tags
      </button>
    );
  }

  return (
    <div className={styles.tagsList}>
      <TagIcon size={18} className={styles.tagIcon}/>

      <div className={styles.tags}>
        {tags.map((tagName, index) => {
          return (
            <Link
              className={styles.tag}
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

      { showEditButton &&
        <button
          type="button"
          className={styles.editButton}
          onClick={showTagsModal}
        >
          <PencilIcon size={18} className={styles.button}/>
        </button>
    }
    </div>
  );
}
