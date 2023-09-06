import { useState, useRef, useEffect } from "react";
import { EyeIcon, CodeIcon } from "@primer/octicons-react";

import MarkdownRenderer from "@components/MarkdownRenderer";
import classNames from "classnames";

import styles from "./ContentEditor.module.scss";

const CONTENT_MAX_LENGTH = 5000;

interface ContentEditorProps {
  content: string;
  setContent: (content: string) => void;
}

export default function ContentEditor({ content, setContent }: ContentEditorProps) {
  const [previewing, setPreviewing] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fixTextareaHeight = () => {
    if(!textareaRef.current) return;

    textareaRef.current.style.height = "0px";
    const textareaHeight = `${textareaRef.current.scrollHeight}px`;
    textareaRef.current.style.height = textareaHeight;
  };

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if(e.ctrlKey && e.key === "p") {
        e.preventDefault();
        setPreviewing(!previewing);
      }
    };

    window.addEventListener("keydown", fn);

    return () => window.removeEventListener("keydown", fn);
  }, [previewing]);

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
        name="blogpost-content"
      ></textarea>
    );
  };

  const buttonClassNames = classNames("custom-btn", styles.option);

  return (
    <div className={styles.contentEditor}>
      <div className={styles.optionsContainer}>
        <button
          className={classNames(buttonClassNames, {[styles.active]: !previewing})}
          onClick={() => setPreviewing(false)}
          type="button"
        >
          <CodeIcon size={14} className="icon"/>
          Edit
        </button>

        <button
          className={classNames(buttonClassNames, {[styles.active]: previewing})}
          onClick={() => setPreviewing(true)}
          type="button"
        >
          <EyeIcon size={14} className="icon" />
          Preview
        </button>
      </div>

      { getContent() }
    </div>
  );
}
