import { useState } from "react";

import CreateTag from "./CreateTag";
import TagList from "./TagList";
import Spinner from "../../Spinner";

import Modal, { UseModalReturn } from "../../Modal";

import { PlusIcon } from "@primer/octicons-react";
import { Tag } from "@services/TagService";

import styles from "./TagsModal.module.scss";

interface TagsModalProps {
  modal: UseModalReturn;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  otherOption?: JSX.Element | JSX.Element[];
  loading?: boolean;
}

const getNamesFromTags = (tags: Tag[]): string[] => tags.map(tag => tag.name);

export default function TagsModal({
  modal,
  selectedTags,
  setSelectedTags,
  otherOption,
  loading
}: TagsModalProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);

  const isSelectedTag = (tag: string): boolean => {
    return selectedTags.includes(tag);
  };

  const toggleTag = (tag: string): void => {
    if(!isSelectedTag(tag)) {
      return setSelectedTags([...selectedTags, tag]);
    }

    setSelectedTags(
      selectedTags.filter(selectedTag => selectedTag !== tag)
    );
  };

  return (
    <Modal title="Tags" modal={modal}>
      <div className={styles.tagsModal}>
        {loading &&
          <div className={styles.loader}>
            <Spinner size={50} />
          </div>
        }

        <div className={styles.tagsContainer}>
          <div className={styles.tags}>
            <TagList
              isSelectedTag={isSelectedTag}
              toggleTag={toggleTag}
              tags={tags}
              setTags={(tags: Tag[]) => setTags(getNamesFromTags(tags))}
            />
          </div>
        </div>

        <CreateTag
          cancelCreating={() => setCreating(false)}
          addTag={(newTag) => setTags([...tags, newTag])}
          isActive={creating}
        />

        {!creating &&
          <div className={styles.options}>
            <button
              className="custom-btn"
              onClick={() => setCreating(true)}
            >
              <PlusIcon size={14} className="icon"/>
              Create new tag
            </button>

            {otherOption}
          </div>
      }
      </div>
    </Modal>
  );
}
