import MarkdownRenderer from "@components/MarkdownRenderer";
import Spinner from "@components/Spinner";

import { toast } from "react-toastify";
import { useState } from "react";
import { BlogPost, updateContent } from "@services/BlogPostService";

import ContentEditor from "@components/BlogPostForm/ContentEditor";

import {
  FileCodeIcon,
  ReplyIcon,
  SidebarCollapseIcon
} from "@primer/octicons-react";

import styles from "./Content.module.scss";

interface ContentProps {
  blogPostId: BlogPost["_id"];
  content: BlogPost["content"];
  isAdmin: boolean;
}

export default function Content({ blogPostId, content: initialContent, isAdmin }: ContentProps) {
  const [content, setContent] = useState(initialContent);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCancelButton = () => {
    setEditing(false);
    setContent(initialContent);
  };

  const handleUpdateContent = async () => {
    setLoading(true);

    if(await updateContent(blogPostId, content)) {
      setEditing(false);
      toast.success("Content updated successfully");
    } else {
      toast.error("There was an error trying to update the content");
    }

    setLoading(false);
  };

  const otherOptions = (
    <div className={styles.rightOptions}>
      <button
        className={`${styles.button} ${styles.option}`}
        onClick={handleUpdateContent}
      >
        <SidebarCollapseIcon size={14} className={styles.icon}/>
        Update
      </button>

      <button
        className={`${styles.button} ${styles.option}`}
        onClick={handleCancelButton}
      >
        <ReplyIcon size={14} className={styles.icon}/>
        Cancel
      </button>
    </div>
  );

  const getContent = () => {
    if(!editing) {
      return (
        <div className={`${styles.mainContentRenderer} ${isAdmin && styles.isAdmin}`}>
          <MarkdownRenderer markdown={content}/>
        </div>
      );
    }

    return (
      <ContentEditor
        content={content}
        setContent={setContent}
        otherOptions={otherOptions}
      />
    );
  };

  return (
    <div className={styles.contentContainer}>
      {loading &&
        <div className={styles.loaderContainer}>
          <Spinner size={50}/>
          <p className={styles.text}>Updating content</p>
        </div>
      }

      {!editing && isAdmin &&
        <button
          className={`${styles.button} ${styles.editButton}`}
          onClick={() => setEditing(true)}
        >
          <FileCodeIcon size={12} className={styles.icon}/>
          Edit Content
        </button>
      }

      { getContent() }
    </div>
  );
}
