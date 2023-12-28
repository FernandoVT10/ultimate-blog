import { useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";

import Spinner from "@components/Spinner";
import classNames from "classnames";

import styles from "./TagSelector.module.scss";

interface TagSelectorProps {
  isSelectedTag: (tagName: string) => boolean;
  toggleTag: (tagName: string) => void;
  tags: string[];
  loading: boolean;
}

export default function TagSelector({ isSelectedTag, toggleTag, tags, loading }: TagSelectorProps) {
  const [search, setSearch] = useState("");

  const getTags = useMemo<string[]>(() => {
    if(!search) return tags;

    // filter tags using the search text
    return tags.filter(tag => {
      const tagName = tag.toLowerCase();
      const lowerSearch = search.toLowerCase();
      return tagName.startsWith(lowerSearch);
    });
  }, [search, tags]);

  if(loading) {
    return (
      <div className={styles.stateContainer}>
        <Spinner size={30}/>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.searchInput}>
        <label
          htmlFor="search-tag-input"
          className={styles.label}
        >
          <FaSearch size={16} />
        </label>

        <input
          type="search"
          className={classNames("custom-input", styles.input)}
          placeholder="Search a tag"
          id="search-tag-input"
          value={search}
          onChange={({ target: { value }}) => setSearch(value)}
        />
      </div>

      {getTags.length ? (
        <div className={styles.tags}>
          {getTags.map((tag, index) => {
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
      ) : (
        <div className={styles.stateContainer}>
          <p className={styles.message}>
            {search ? "No results" : "There are no tags"}
          </p>
        </div>
      )}
    </div>
  );
}
