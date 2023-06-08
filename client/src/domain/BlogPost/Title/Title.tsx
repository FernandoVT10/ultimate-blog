import { toast } from "react-toastify";
import { BlogPost } from "@customTypes/collections";
import { useMutation } from "@hooks/api";
import { serverErrorHandler } from "@utils/errorHandlers";
import { FileDirectoryOpenFillIcon } from "@primer/octicons-react";
import { FormEvent, useState } from "react";

import Button from "@components/Button";
import TitleInput from "@components/BlogPostForm/TitleInput";

import styles from "./Title.module.scss";

interface TitleProps {
  blogPostId: BlogPost["_id"];
  title: BlogPost["title"];
  isAdmin: boolean;
}

export default function Title({ blogPostId, title: initialTitle, isAdmin }: TitleProps) {
  const { loading, run: updateTitle } = useMutation(
    "put",
    `/blogposts/${blogPostId}/updateTitle`,
    serverErrorHandler
  );
  const [title, setTitle] = useState(initialTitle);
  const [actualTitle, setActualTitle] = useState(initialTitle);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const res = await updateTitle({ title });

    if(res.success) {
      setActualTitle(title);
      document.title = title;
      toast.success("Title updated successfully");
    }
  };

  if(!isAdmin) {
    return <h1 className={styles.title}>{ actualTitle }</h1>;
  }

  return (
    <div className={styles.titleForm}>
      <form onSubmit={handleSubmit}>
        <TitleInput title={title} setTitle={setTitle}/>

        <Button
          type="submit"
          text="Update Title"
          loadingText={"Updating"}
          show={title !== actualTitle}
          icon={FileDirectoryOpenFillIcon}
          className={styles.button}
          loading={loading}
        />
      </form>
    </div>
  );
}
