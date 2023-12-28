import { useState, useEffect } from "react";
import { useModal } from "@components/Modal";
import { Tag } from "@customTypes/collections";
import { useQuery } from "@hooks/api";
import { FaPlus } from "react-icons/fa";

import CreateTagModal from "./CreateTagModal";
import TagSelector from "./TagSelector";
import TagBadgets from "./TagBadgets";
import Button from "@components/Button";

import styles from "./TagEditor.module.scss";

interface TagEditorProps {
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  optionalButton?: JSX.Element;
}

export const getNamesFromTags = (tags: Tag[]): string[] => tags.map(tag => tag.name);

export default function TagEditor({ selectedTags, setSelectedTags, optionalButton }: TagEditorProps) {
  const [tags, setTags] = useState<string[]>([]);
  const { value: initialTags, loading } = useQuery<Tag[]>("/tags");

  const modalInstance = useModal();

  useEffect(() => {
    setTags(getNamesFromTags(initialTags || []));
  }, [initialTags]);

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

  const onTagCreation = (newTag: string) => {
    setTags([...tags, newTag]);
  };

  return (
    <div className={styles.tagEditor}>
      <CreateTagModal
        onTagCreation={onTagCreation}
        modal={modalInstance}
      />

      { selectedTags.length > 0 &&
        <div className={styles.tagBadgets}>
          <TagBadgets tags={selectedTags}/>
        </div>
      }

      <div className={styles.tagSelectorContainer}>
        <TagSelector
          isSelectedTag={isSelectedTag}
          toggleTag={toggleTag}
          tags={tags}
          loading={loading}
        />
      </div>

      <div className={styles.buttons}>
        <Button
          text="Create Tag"
          icon={FaPlus}
          onClick={modalInstance.showModal}
        />

        { optionalButton }
      </div>
    </div>
  );
}
