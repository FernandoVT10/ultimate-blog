import { toast } from "react-toastify";
import { BlogPost } from "@customTypes/collections";
import { useMutation } from "@hooks/api";
import { serverErrorHandler } from "@utils/errorHandlers";
import { FileDirectoryOpenFillIcon } from "@primer/octicons-react";
import { FormEvent, useState } from "react";

import Spinner from "@components/Spinner";

import styles from "./Title.module.scss";

// TODO: it's better to get this number from the BlogPost model of the server
const TITLE_MAX_LENGTH = 100;

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

    if(await updateTitle({ title })) {
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
        <div className={styles.titleInput}>
          <label
            htmlFor="title-input"
            className={styles.label}
          >
            {"Title"}
          </label>

          <input
            type="text"
            id="title-input"
            value={title}
            placeholder="Write an amazing title"
            onChange={({ target: { value } }) => setTitle(value)}
            className={styles.input}
            maxLength={TITLE_MAX_LENGTH}
            autoComplete="off"
            required
          />
        </div>

        { title !== actualTitle &&
          <button
            className={`custom-btn ${styles.button}`}
            type="submit"
            disabled={loading}
          >
            {loading ?
              <>
                <Spinner size={10} borderWidth={2} className={styles.loader}/>
                {"Updating"}
              </>
            :
              <>
                <FileDirectoryOpenFillIcon size={14} className="icon"/>
                {"Update Title"}
              </>
            }
          </button>
        }
      </form>
    </div>
  );
}
