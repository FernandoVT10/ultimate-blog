import { Comment as CommentType } from "@customTypes/collections";
import { useEffect, useState } from "react";
import { getDayAndMonth } from "@utils/formatters";
import { useAuthProvider } from "@providers/AuthProvider";

import DeleteCommentButton from "./DeleteCommentButton";
import CommentForm from "../CommentForm";

import styles from "./Comment.module.scss";

// This solves a problem with moment.js and the utc date strings
// When moment runs on the server it returns a different date than in the client
// causing a react hydratation error
// More info: https://maggiepint.com/2016/05/14/moment-js-shows-the-wrong-date
const CommentDate = ({ date }: { date: string }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if(!isClient) return;

  return (
    <span className={styles.date}>
      {getDayAndMonth(date)}
    </span>
  );
};

interface BaseCommentProps {
  comment: CommentType;
  onCommentDeletion: (commentId: string) => void;
  isFormActive: boolean;
  toggleIsFormActive: () => void;
  onReplyCreation: (createdReply: CommentType) => void;
  replyParentId: string;
}

const BaseComment = ({
  comment,
  onCommentDeletion,
  isFormActive,
  toggleIsFormActive,
  onReplyCreation,
  replyParentId,
}: BaseCommentProps) => {
  const authStatus = useAuthProvider();

  return (
    <>
      <div className={styles.comment}>
        <div className={styles.head}>
          <div>
            <span className={styles.authorName}>{comment.authorName}</span>
            <CommentDate date={comment.createdAt}/>
          </div>

          { authStatus.isLogged && (
            <DeleteCommentButton
              commentId={comment._id}
              onCommentDeletion={onCommentDeletion}
            />
          )}
        </div>

        <p className={styles.content}>{comment.content}</p>

        <button
          onClick={toggleIsFormActive}
          className={styles.replyButton}
        >
          {"Reply"}
        </button>
      </div>

      {isFormActive && (
        <div className={styles.formContainer}>
          <CommentForm
            parentModel="Comment"
            parentId={replyParentId}
            onCommentCreation={onReplyCreation}
            cancelButtonOnClick={toggleIsFormActive}
            isReplyForm
          />
        </div>
      )}
    </>
  );
};

export default BaseComment;
