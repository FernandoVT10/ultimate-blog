import { toast } from "react-toastify";
import { PencilIcon } from "@primer/octicons-react";
import { BlogPost, updateTitle } from "@services/BlogPostService";
import { ChangeEvent, FormEvent, useState } from "react";

import styles from "./Title.module.scss";

// TODO: it's better to get this number from the BlogPost model of the server
const TITLE_MAX_LENGTH = 100;

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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);

    if(await updateTitle(blogPostId, title)) {
      setStaticTitle(title);
      document.title = title;
      toast.success("Title updated successfully");
    }

    setLoading(false);
    setEditing(false);
  };

  if(editing) {
    return (
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={handleInputChange}
            className={styles.input}
            maxLength={TITLE_MAX_LENGTH}
            autoComplete="off"
            required
          />

          <div className={styles.formButtons}>
            <button
              className={styles.formButton}
              type="submit"
              disabled={loading}
            >
              {loading && <span className={styles.loader}></span>}
              {loading ? "Updating" : "Update"}
            </button>

            <button
              className={`${styles.formButton} ${styles.cancelButton}`}
              onClick={() => setEditing(false)}
              disabled={loading}
            >
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
