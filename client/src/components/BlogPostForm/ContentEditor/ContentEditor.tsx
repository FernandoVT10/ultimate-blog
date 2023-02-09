import { useState, useRef, useEffect } from "react";

import MarkdownRenderer from "@components/MarkdownRenderer";

import { EyeIcon, FileCodeIcon } from "@primer/octicons-react";

import styles from "./ContentEditor.module.scss";

const CONTENT_MAX_LENGTH = 5000;

interface ContentEditorProps {
  content: string;
  setContent: (content: string) => void;
  otherOptions?: JSX.Element;
}

export default function ContentEditor({
  content,
  setContent,
  otherOptions
}: ContentEditorProps) {
  const [previewing, setPreviewing] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fixTextareaHeight = () => {
    if(!textareaRef.current) return;

    textareaRef.current.style.height = "0px";
    const textareaHeight = `${textareaRef.current.scrollHeight}px`;
    textareaRef.current.style.height = textareaHeight;
  };

  useEffect(() => {
    fixTextareaHeight();
  }, [previewing]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    fixTextareaHeight();
  };

  const getContent = () => {
    if(previewing) {
      return (
        <div className={styles.contentRenderer}>
          <MarkdownRenderer markdown={content}/>
        </div>
      );
    }

    return (
      <textarea
        className={styles.textarea}
        maxLength={CONTENT_MAX_LENGTH}
        placeholder="Write something interesting"
        value={content}
        onChange={handleTextareaChange}
        ref={textareaRef}
        required
      ></textarea>
    );
  };

  return (
    <div className={styles.contentEditor}>
      <div className={styles.optionsContainer}>
        <div className={styles.leftOptions}>
          <button
            className={`${styles.button} ${styles.option} ${!previewing && styles.active}`}
            onClick={() => setPreviewing(false)}
            type="button"
          >
            <FileCodeIcon size={14} className={styles.icon}/>
            Edit
          </button>

          <button
            className={`${styles.button} ${styles.option} ${previewing && styles.active}`}
            onClick={() => setPreviewing(true)}
            type="button"
          >
            <EyeIcon size={14} className={styles.icon}/>
            Preview
          </button>
        </div>

        { otherOptions }
      </div>

      { getContent() }
    </div>
  );
}
