import { useState } from "react";

import CreateTag from "./CreateTag";

import Modal, { UseModalReturn } from "@components/Modal";
import { PlusIcon, SidebarCollapseIcon } from "@primer/octicons-react";

import styles from "./TagsModal.module.scss";

interface TagsModalProps {
  modal: UseModalReturn;
}

const initialTags: string[] = [];

for(let i = 0; i <= 50; i++) {
  initialTags.push(`Test #${i}`);
}

export default function TagsModal({ modal }: TagsModalProps) {
  const [tags, setTags] = useState(initialTags);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);

  const includeTag = (tag: string): boolean => {
    return selectedTags.includes(tag);
  };

  const toggleTag = (tag: string): void => {
    if(!includeTag(tag)) {
      return setSelectedTags([...selectedTags, tag]);
    }

    setSelectedTags(
      selectedTags.filter(selectedTag => selectedTag !== tag)
    );
  };

  return (
    <Modal title="Tags" modal={modal}>
      <div className={styles.tagsModal}>
        <div className={styles.tags}>
          {tags.map((tag, index) => {
            const isSelected = includeTag(tag);

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

        { creating
          ?
          <CreateTag cancelCreating={() => setCreating(false)}/>
          :
          <div className={styles.options}>
            <button
              className="custom-btn"
              onClick={() => setCreating(true)}
            >
              <PlusIcon size={14} className="icon"/>
              Create new tag
            </button>

            <button className={`custom-btn ${styles.createTagButton}`}>
              <SidebarCollapseIcon size={14} className="icon"/>
              Update tags
            </button>
          </div>
      }
      </div>
    </Modal>
  );
}
