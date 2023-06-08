import { FormEvent, useState } from "react";
import { useMutation } from "@hooks/api";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import Modal, { UseModalReturn } from "@components/Modal";
import {
  FileDirectoryOpenFillIcon,
  XCircleFillIcon,
  XIcon
} from "@primer/octicons-react";

import Button from "@components/Button";
import classNames from "classnames";

import styles from "./CreateTagModal.module.scss";

export const TAG_NAME_MAX_LENGTH = 100;

interface CreateTagModalProps {
  onTagCreation: (newTag: string) => void;
  modal: UseModalReturn
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getErrorMessage = (error: any): string => {
  console.log(error);
  if(error instanceof AxiosError && error.response?.status === 400) {
    const message = error.response.data.errors[0].message;
    return message;
  }

  return "There was an error. Try it later.";
};

export default function CreateTagModal({ onTagCreation, modal }: CreateTagModalProps) {
  const [name, setName] = useState("");

  const { error, loading, run: createTag } = useMutation("post", "/tags");

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    const res = await createTag({ name });

    if(res.success) {
      onTagCreation(name);
      setName("");
      modal.hideModal();
      toast.success("Tag created successfully");
    }
  };

  return (
    <Modal title="Create Tag" modal={modal}>
      <div className={styles.createTagModal}>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            id="create-tag-input"
            onChange={({ target: { value } }) => setName(value)}
            placeholder="Enter a name"
            className={classNames(styles.input, "custom-input")}
            maxLength={TAG_NAME_MAX_LENGTH}
            required
          />

          {error && 
            <div className={styles.error}>
              <XCircleFillIcon size={14} className={styles.icon}/>
              <p className={styles.message}>{ getErrorMessage(error) }</p>
            </div>
          }

          <div className={styles.buttons}>
            <Button
              type="submit"
              text="Create Tag"
              loadingText="Creating"
              loading={loading}
              icon={FileDirectoryOpenFillIcon}
              className={styles.button}
            />

            <Button
              text="Cancel"
              icon={XIcon}
              onClick={modal.hideModal}
              className="caution"
            />
          </div>
        </form>
      </div>
    </Modal>
  );
}
