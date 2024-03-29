import Modal, { useModal } from "@components/Modal";

import { FaTrash } from "react-icons/fa";
import { BlogPost } from "@customTypes/collections";
import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useMutation } from "@hooks/api";
import { serverErrorHandler } from "@utils/errorHandlers";

import classNames from "classnames";
import Button from "@components/Button";

import styles from "./DeletePost.module.scss";

const ACCEPT_TEXT = "I understand";

interface DeletePostProps {
  blogPostId: BlogPost["_id"];
}

export default function DeletePost({ blogPostId }: DeletePostProps) {
  const [confirmationText, setConfirmationText] = useState("");
  const [valid, setValid] = useState(false);
  const { run: deletePost, loading } = useMutation(
    "delete",
    `/blogposts/${blogPostId}`,
    serverErrorHandler
  );

  const modal = useModal();
  const router = useRouter();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setValid(value === ACCEPT_TEXT);
    setConfirmationText(value);
  };

  const handleDeletePost = async (): Promise<void> => {
    if(!valid) return;

    const res = await deletePost();

    if(res.success) {
      toast.success("Post deleted successfully");
      router.push("/blog");
    }
  };

  return (
    <div className={styles.container}>
      <Modal title="Are you sure?" modal={modal}>
        <div className={styles.warningContainer}>
          <p className={styles.warning}>
            Write <b>&quot;{ ACCEPT_TEXT }&quot;</b> to confirm the action.
          </p>

          <input
            type="text"
            placeholder="Write I understand"
            className={classNames("custom-input", styles.input)}
            onChange={handleInputChange}
            value={confirmationText}
            name="confirm-delete-post"
          />

          <Button
            text="I understand, delete post"
            className={styles.acceptButton}
            onClick={handleDeletePost}
            disabled={!valid}
            loading={loading}
            loadingText="Deleting Post"
          />
        </div>
      </Modal>

      <h4 className={styles.title}>Delete Post</h4>

      <p className={styles.description}>
        {"The blog post is going to be deleted permanently, and this action can't be reverted."}
      </p>

      <Button
        text="Delete Post"
        icon={FaTrash}
        className="caution"
        onClick={() => modal.showModal()}
      />
    </div>
  );
}
