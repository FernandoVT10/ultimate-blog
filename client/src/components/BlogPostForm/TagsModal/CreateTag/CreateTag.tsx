import Spinner from "@components/Spinner";

import { TAG_NAME_MAX_LENGTH } from "@config/constants";
import { ReplyIcon, SidebarCollapseIcon, XCircleFillIcon } from "@primer/octicons-react";
import { createTag as createTagService } from "@services/TagService";
import { FormEvent, useState } from "react";

import styles from "./CreateTag.module.scss";

interface CreateTagProps {
  cancelCreating: () => void;
  addTag: (newTag: string) => void;
  isActive: boolean;
}

export default function CreateTag({ cancelCreating, addTag, isActive }: CreateTagProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    setLoading(true);

    const res = await createTagService(name);

    if(res.success) {
      addTag(name);
      cancelCreating();
      setName("");
      setError("");
    } else if(res.error) {
      setError(res.error);
    }

    setLoading(false);
  };

  if(!isActive) return null;

  return (
    <div className={styles.createTag}>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={name}
            onChange={({ target: { value } }) => setName(value)}
            placeholder="Enter a name"
            className={styles.input}
            required
            maxLength={TAG_NAME_MAX_LENGTH}
          />

          <label className={styles.label}>Name</label>
        </div>

        {error && 
          <div className={styles.error}>
            <XCircleFillIcon size={14} className={styles.icon}/>
            <p className={styles.message}>{ error }</p>
          </div>
        }

        <div className={styles.buttons}>
          <button
            type="submit"
            className={`custom-btn ${styles.createButton}`}
            disabled={loading}
          >
            {
              loading
              ? <Spinner size={10} borderWidth={2} className={styles.spinner}/>
              : <SidebarCollapseIcon size={14} className="icon"/>
            }

            { loading ? "Creating" : "Create" }
          </button>

          <button
            className="custom-btn"
            onClick={cancelCreating}
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
