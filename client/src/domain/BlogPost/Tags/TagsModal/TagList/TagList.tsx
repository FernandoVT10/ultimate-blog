import { useEffect, useState } from "react";
import { getTags as getTagsService, Tag } from "@services/TagService";

import Spinner from "@components/Spinner";

import styles from "./TagList.module.scss";

interface TagListProps {
  isSelectedTag: (tagName: string) => boolean;
  toggleTag: (tagName: string) => void;
  tags: string[];
  setTags: (tags: Tag[]) => void;
}

export default function TagList({ isSelectedTag, toggleTag, tags, setTags }: TagListProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTags() {
      const tags = await getTagsService();

      setTags(tags);

      setLoading(false);
    }

    fetchTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if(loading) {
    return (
      <div className={styles.stateContainer}>
        <Spinner size={30}/>
      </div>
    );
  }

  if(!tags.length) {
    return (
      <div className={styles.stateContainer}>
        <p className={styles.message}>There are no tags</p>
      </div>
    );
  }

  return (
    <div className={styles.tagList}>
      {tags.map((tag, index) => {
        const isSelected = isSelectedTag(tag);

        return (
          <div
            className={`${styles.tag} ${isSelected && styles.selected}`}
            key={index}
          >
            <label
              htmlFor={`tagsModal-checkbox-${index}`}
              className={styles.label}
            >
              <span className={styles.indicator}></span>
              <p className={styles.name}>{ tag }</p>
            </label>

            <input
              type="checkbox"
              id={`tagsModal-checkbox-${index}`}
              className={styles.checkbox}
              onChange={() => toggleTag(tag)}
              checked={isSelected}
              />
          </div>
        );
    })}
    </div>
  );
}
