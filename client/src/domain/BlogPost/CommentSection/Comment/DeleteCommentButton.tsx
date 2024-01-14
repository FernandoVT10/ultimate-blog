import { FaTrash } from "react-icons/fa";
import { useMutation } from "@hooks/api";
import { serverErrorHandler } from "@utils/errorHandlers";
import { toast } from "react-toastify";

import Modal, { useModal } from "@components/Modal";

import Button from "@components/Button";
import classNames from "classnames";

import styles from "./Comment.module.scss";

interface DeleteCommentButtonProps {
  commentId: string;
  onCommentDeletion: (commentId: string) => void;
}

const DeleteCommentButton = ({ commentId, onCommentDeletion }: DeleteCommentButtonProps) => {
  const { run: deleteComment, loading } = useMutation(
    "delete", `/comments/${commentId}`, serverErrorHandler
  );
  const modal = useModal();

  const handleDeleteComment = async () => {
    const res = await deleteComment();

    if(res.success) {
      onCommentDeletion(commentId);
      modal.hideModal();
      toast.success("Comment deleted successfully");
    }
  };

  return (
    <>
      <Modal title="Do you want to delete this comment?" modal={modal}>
        <div className={styles.confirmationButtons}>
          <Button
            text="Yes"
            className={styles.button}
            onClick={handleDeleteComment}
            loading={loading}
            loadingText={"Deleting Comment"}
          />

          <Button
            text="No"
            className={classNames("caution", styles.button)}
            onClick={modal.hideModal}
            disabled={loading}
          />
        </div>
      </Modal>

      <button
        className={classNames("custom-btn", "caution", styles.deleteButton)}
        onClick={modal.showModal}
      >
        <FaTrash className={styles.icon}/>
      </button>
    </>
  );
};

export default DeleteCommentButton;
