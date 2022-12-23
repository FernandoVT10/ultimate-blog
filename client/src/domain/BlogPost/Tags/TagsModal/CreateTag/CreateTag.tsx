import { TAG_NAME_MAX_LENGTH } from "@config/constants";
import { ReplyIcon, SidebarCollapseIcon } from "@primer/octicons-react";
import { FormEvent, useState } from "react";

import styles from "./CreateTag.module.scss";

interface CreateTagProps {
  cancelCreating: () => void;
}

export default function CreateTag({ cancelCreating }: CreateTagProps) {
  const [name, setName] = useState("");

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
  };

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

        <div className={styles.buttons}>
          <button
            type="submit"
            className={`custom-btn ${styles.cancelButton}`}
          >
            <SidebarCollapseIcon size={14} className="icon"/>
            Create
          </button>

          <button
            className="custom-btn"
            onClick={cancelCreating}
          >
            <ReplyIcon size={14} className="icon"/>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
