import { toast } from "react-toastify";
import { BlogPost, updateTitle } from "@services/BlogPostService";
import { FileCodeIcon, PencilIcon, ReplyIcon } from "@primer/octicons-react";
import { FormEvent, useState } from "react";

import TitleInput from "@components/BlogPostForm/TitleInput";
import Spinner from "@components/Spinner";

import styles from "./Title.module.scss";

interface TitleProps {
  blogPostId: BlogPost["_id"];
  title: BlogPost["title"];
  isAdmin: boolean;
}

export default function Title({ blogPostId, title: initialTitle, isAdmin }: TitleProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  // this is the title that's gonna be shown
  const [staticTitle, setStaticTitle] = useState(initialTitle);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const success = await updateTitle(blogPostId, title);

    if(success) {
      setStaticTitle(title);
      document.title = title;
      toast.success("Title updated successfully");
    } else {
      toast.error("There was an error trying to update the title");
    }

    setLoading(false);
    setEditing(false);
  };

  if(editing) {
    return (
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <TitleInput title={title} setTitle={(title) => setTitle(title)}/>

          <div className={styles.formButtons}>
            <button
              className={`custom-btn ${styles.formButton}`}
              type="submit"
              disabled={loading}
            >
              {loading ?
                <>
                  <Spinner size={10} borderWidth={2} className={styles.loader}/>
                  Updating
                </>
              :
                <>
                  <FileCodeIcon size={14} className="icon"/>
                  Update
                </>
              }
            </button>

            <button
              className={`custom-btn ${styles.formButton} ${styles.cancelButton}`}
              onClick={() => setEditing(false)}
              disabled={loading}
            >
              <ReplyIcon size={14} className="icon"/>
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.titleContainer}>
      <h1 className={styles.title}>{ staticTitle }</h1>

      {isAdmin &&
        <button className={styles.button} onClick={() => setEditing(true)}>
          <PencilIcon size={20}/>
        </button>
      }
    </div>
  );
}
