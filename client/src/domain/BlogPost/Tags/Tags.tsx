import TagsModal from "@components/BlogPostForm/TagsModal";
import TagsList from "@components/BlogPostForm/TagsList";

import { useModal } from "@components/Modal";
import { useState } from "react";
import { Tag } from "@services/TagService";
import { toast } from "react-toastify";

import { BlogPost, updateTags } from "@services/BlogPostService";
import { SidebarCollapseIcon } from "@primer/octicons-react";


import styles from "./Tags.module.scss";

interface TagsProps {
  tags: Tag[];
  isAdmin: boolean;
  blogPostId: BlogPost["_id"];
}

const getNamesFromTags = (tags: Tag[]): string[] => tags.map(tag => tag.name);

export default function Tags({ tags: initialTags, isAdmin, blogPostId }: TagsProps) {
  const [tags, setTags] = useState(initialTags);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    getNamesFromTags(initialTags)
  );
  const [loading, setLoading] = useState(false);

  const modal = useModal();

  const handleUpdateTags = async () => {
    setLoading(true);

    if(await updateTags(blogPostId, selectedTags)) {
      setTags(selectedTags.map(tagName => {
        return {
          _id: "",
          name: tagName
        };
      }));

      modal.hideModal();
      toast.success("Tags updated successfully");
    } else {
      toast.error("There was an error trying to update the tags");
    }

    setLoading(false);
  };

  const updateTagsOption = (
    <button
      className={`custom-btn ${styles.createTagButton}`}
      onClick={handleUpdateTags}
    >
      <SidebarCollapseIcon size={14} className="icon"/>
      Update tags
    </button>
  );

  return (
    <div className={styles.tagsContainer}>
      <TagsModal
        modal={modal}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        otherOption={updateTagsOption}
        loading={loading}
      />

      <TagsList
        tags={tags.map(tag => tag.name)}
        showEditButton={isAdmin}
        showTagsModal={() => modal.showModal()}
      />
    </div>
  );
}
