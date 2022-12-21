import MarkdownRenderer from "@components/MarkdownRenderer";
import Spinner from "@components/Spinner";

import { toast } from "react-toastify";
import { CONTENT_MAX_LENGTH } from "@config/constants";
import { BlogPost, updateContent } from "@services/BlogPostService";
import { ChangeEvent, useRef, useState, useEffect } from "react";

import {
  EyeIcon,
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
  const [previewing, setPreviewing] = useState(false);
  const [loading, setLoading] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fixTextareaHeight = () => {
    if(!textareaRef.current) return;

    textareaRef.current.style.height = "0px";
    const textareaHeight = `${textareaRef.current.scrollHeight}px`;
    textareaRef.current.style.height = textareaHeight;
  };

  useEffect(() => {
    fixTextareaHeight();
  }, [editing, previewing]);

  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    fixTextareaHeight();
  };

  const handleUpdateContent = async () => {
    setLoading(true);

    if(await updateContent(blogPostId, content)) {
      setEditing(false);
      toast.success("Content updated successfully");
    }

    setLoading(false);
  };

  const getOptions = () => {
    if(!editing) return null;

    return (
      <div className={styles.optionsContainer}>
        <div className={styles.leftOptions}>
          <button
            className={`${styles.button} ${styles.option} ${!previewing && styles.active}`}
            onClick={() => setPreviewing(false)}
          >
            <FileCodeIcon size={14} className={styles.icon}/>
            Edit
          </button>

          <button
            className={`${styles.button} ${styles.option} ${previewing && styles.active}`}
            onClick={() => setPreviewing(true)}
          >
            <EyeIcon size={14} className={styles.icon}/>
            Preview
          </button>
        </div>

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
            onClick={() => setEditing(false)}
          >
            <ReplyIcon size={14} className={styles.icon}/>
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const getContent = () => {
    if(!editing || editing && previewing) {
      const contentClass = editing && previewing && styles.previewing;

      return (
        <div className={`${styles.content} ${contentClass} ${isAdmin && styles.isAdmin}`}>
          <MarkdownRenderer markdown={content}/>
        </div>
      );
    }

    return (
      <div className={styles.formContainer}>
        <form onSubmit={(e) => e.preventDefault()}>
          <textarea
            className={styles.textarea}
            maxLength={CONTENT_MAX_LENGTH}
            placeholder="Write something interesting"
            value={content}
            onChange={handleTextareaChange}
            ref={textareaRef}
            required
          ></textarea>
        </form>
      </div>
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

      { getOptions() }
      { getContent() }
    </div>
  );
}
