import TagsModal from "./TagsModal";
import Link from "next/link";

import { TagIcon, PencilIcon } from "@primer/octicons-react";
import { useModal } from "@components/Modal";

import styles from "./Tags.module.scss";

interface TagsProps {
  tags: { name: string }[];
  isAdmin: boolean;
}

export default function Tags({ tags, isAdmin }: TagsProps) {
  const modal = useModal();

  const getTags = () => {
    if(tags.length) {
      return (
        <div className={styles.tags}>
          {tags.map((tag, index) => {
            return (
              <Link
                className={styles.tag}
                href={`/blog?tags=${tag.name}`}
                key={index}
              >
                <span key={index}>
                  { tag.name }
                </span>
              </Link>
            );
          })}
        </div>
      );
    }
  };

  return (
    <div className={styles.tagsContainer}>
      <TagsModal modal={modal}/>

      <div className={styles.tagsListContainer}>
        <TagIcon size={18} className={styles.tagIcon}/>

        { getTags() }

        { isAdmin &&
          <button
            className={styles.editButton}
            onClick={() => modal.showModal()}
          >
            <PencilIcon size={18} className={styles.button}/>
          </button>
        }
      </div>
    </div>
  );
}
