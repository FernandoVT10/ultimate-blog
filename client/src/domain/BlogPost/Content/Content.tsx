import MarkdownRenderer from "@components/MarkdownRenderer";

import { toast } from "react-toastify";
import { FormEvent, useState } from "react";
import { BlogPost } from "@customTypes/collections";

import ContentEditor from "@components/BlogPostForm/ContentEditor";
import Button from "@components/Button";

import { FaFolder } from "react-icons/fa";

import styles from "./Content.module.scss";
import { useMutation } from "@hooks/api";
import { serverErrorHandler } from "@utils/errorHandlers";

interface ContentProps {
  blogPostId: BlogPost["_id"];
  content: BlogPost["content"];
  isAdmin: boolean;
}

export default function Content({ blogPostId, content: initialContent, isAdmin }: ContentProps) {
  const { loading, run: updateContent } = useMutation(
    "put",
    `/blogposts/${blogPostId}/updateContent`,
    serverErrorHandler
  );

  const [content, setContent] = useState(initialContent);
  const [actualContent, setActualContent] = useState(initialContent);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const res = await updateContent({ content });

    if(res.success) {
      toast.success("Content updated successfully");
      setActualContent(content);
    }
  };

  if(!isAdmin) {
    return (
      <div className={styles.mainContentRenderer}>
        <MarkdownRenderer markdown={content}/>
      </div>
    );
  }

  return (
    <div className={styles.contentContainer}>
      <form onSubmit={handleSubmit}>
        <ContentEditor
          content={content}
          setContent={setContent}
        />

        <Button
          type="submit"
          text="Update Content"
          loadingText="Updating"
          show={actualContent !== content}
          className={styles.button}
          icon={FaFolder}
          loading={loading}
        />
      </form>
    </div>
  );
}
