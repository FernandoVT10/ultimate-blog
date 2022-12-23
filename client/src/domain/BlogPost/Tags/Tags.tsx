import TagsModal from "./TagsModal";
import Link from "next/link";

import { TagIcon, PencilIcon } from "@primer/octicons-react";
import { useModal } from "@components/Modal";
import { BlogPost } from "@services/BlogPostService";
import { useState } from "react";
import { Tag } from "@services/TagService";

import styles from "./Tags.module.scss";

interface TagsProps {
  tags: Tag[];
  isAdmin: boolean;
  blogPostId: BlogPost["_id"];
}

export default function Tags({ tags: initialTags, isAdmin, blogPostId }: TagsProps) {
  const [tags, setTags] = useState(initialTags);

  const modal = useModal();

  const setUpdatedTags = (tags: string[]) => {
    setTags(tags.map(tagName => {
      return {
        _id: "",
        name: tagName
      };
    }));
  };

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
      <TagsModal
        blogPostId={blogPostId}
        modal={modal}
        initialTags={tags}
        setUpdatedTags={setUpdatedTags}
      />

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
