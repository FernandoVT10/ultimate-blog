import { useState } from "react";

import CreateTag from "./CreateTag";
import TagList from "./TagList";
import Spinner from "@components/Spinner";

import Modal, { UseModalReturn } from "@components/Modal";

import { PlusIcon, SidebarCollapseIcon } from "@primer/octicons-react";
import { Tag } from "@services/TagService";

import { BlogPost, updateTags } from "@services/BlogPostService";

import styles from "./TagsModal.module.scss";

interface TagsModalProps {
  blogPostId: BlogPost["_id"];
  modal: UseModalReturn;
  initialTags: Tag[];
  setUpdatedTags: (tags: string[]) => void;
}

const getNamesFromTags = (tags: Tag[]): string[] => tags.map(tag => tag.name);

export default function TagsModal({ blogPostId, modal, initialTags, setUpdatedTags }: TagsModalProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    getNamesFromTags(initialTags)
  );
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleUpdateTags = async () => {
    setLoading(true);

    if(await updateTags(blogPostId, selectedTags)) {
      setUpdatedTags(selectedTags);
      modal.hideModal();
    }

    setLoading(false);
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

            <button
              className={`custom-btn ${styles.createTagButton}`}
              onClick={handleUpdateTags}
            >
              <SidebarCollapseIcon size={14} className="icon"/>
              Update tags
            </button>
          </div>
      }
      </div>
    </Modal>
  );
}
