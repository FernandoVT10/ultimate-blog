import Modal, { useModal } from "@components/Modal";

import { TrashIcon } from "@primer/octicons-react";
import { BlogPost, deleteBlogPost } from "@services/BlogPostService";
import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

import styles from "./DeleteButton.module.scss";

const ACCEPT_TEXT = "I understand";

interface DeleteButtonProps {
  title: BlogPost["title"];
  isAdmin: boolean;
  blogPostId: BlogPost["_id"];
}

export default function DeleteButton({ title, isAdmin, blogPostId }: DeleteButtonProps) {
  const [confirmationText, setConfirmationText] = useState("");
  const [valid, setValid] = useState(false);

  const modal = useModal();
  const router = useRouter();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setValid(value === ACCEPT_TEXT);
    setConfirmationText(value);
  };

  const deletePost = async () => {
    if(await deleteBlogPost(blogPostId)) {
      toast.success("Post deleted successfully");
      return router.push("/blog");
    }

    toast.error("There was an error trying to delete the post");
  };

  if(!isAdmin) return null;

  return (
    <div className={styles.deleteButton}>
      <Modal title="Are you sure?" modal={modal}>
        <div className={styles.warningContainer}>
          <p className={styles.warning}>
            The blog post <b>{title}</b> is going to be deleted <b>permanently</b>, and can&apos;t
            be reverted.
          </p>

          <p className={styles.warning}>
            Write <b>&quot;{ ACCEPT_TEXT }&quot;</b> to confirm.
          </p>

          <input
            type="text"
            placeholder="Write I understand"
            className={styles.input}
            onChange={handleInputChange}
            value={confirmationText}
          />

          <button
            className={`custom-btn ${styles.acceptButton}`}
            disabled={!valid}
            onClick={deletePost}
          >
            I understand, delete post
          </button>
        </div>
      </Modal>

      <button
        className={`custom-btn ${styles.button}`}
        onClick={() => modal.showModal()}
      >
        <TrashIcon size={14} className="icon" />
        Delete this post
      </button>
    </div>
  );
}
