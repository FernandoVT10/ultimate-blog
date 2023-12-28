import { getDayAndMonth } from "@utils/formatters";
import { useCommentHook } from "./hook";

import CommentForm from "../CommentForm";
import Spinner from "@components/Spinner";

import type { Comment as CommentType } from "@customTypes/collections";

import { FaChevronUp, FaChevronDown } from "react-icons/fa";

import styles from "./Comments.module.scss";

const getPluralReply = (repliesCount: number): string => repliesCount > 1 ? "replies" : "reply";

export type CommentWithRepliesCount = CommentType & {
  repliesCount: number;
};

interface CommentProps {
  comment: CommentWithRepliesCount;
  displayComment: boolean;
}

const Comment = ({ comment, displayComment }: CommentProps) => {
  const {
    isFormActive,
    toggleIsFormActive,
    showReplies,
    handleShowReplies,
    getParentId,
    loading,
    hasReachedMaxLevel,
    replies,
    handleCommentCreation
  } = useCommentHook(comment);

  const { repliesCount } = comment;

  if(!displayComment) return null;

  return (
    <div className={styles.commentContainer}>
      <div className={styles.comment}>
        <div className={styles.head}>
          <span className={styles.authorName}>{comment.authorName}</span>
          <span className={styles.date}>
            {getDayAndMonth(comment.createdAt)}
          </span>
        </div>

        <p className={styles.content}>{comment.content}</p>

        <button
          onClick={toggleIsFormActive}
          className={styles.replyButton}
        >
          {"Reply"}
        </button>
      </div>

      {!hasReachedMaxLevel && repliesCount > 0 && (
        <button
          onClick={handleShowReplies}
          className={styles.showCommentsButton}
        >
          {showReplies ? (
            <FaChevronUp className={styles.icon} size={14}/>
          ) : (
            <FaChevronDown className={styles.icon} size={14}/>
          )}
          {`${repliesCount} ${getPluralReply(repliesCount)}`}
        </button>
      )}

      { isFormActive && (
        <div className={styles.formContainer}>
          <CommentForm
            parentModel="Comment"
            parentId={getParentId}
            cancelButtonOnClick={toggleIsFormActive}
            onCommentCreation={handleCommentCreation}
            showCancelButton
          />
        </div>
      )}

      {loading && (
        <div className={styles.loaderContainer}>
          <Spinner size={30}/>
        </div>
      )}

      {replies && replies.length > 0 && (
        <div className={styles.nestedComments}>
          <Comments comments={replies} displayComments={showReplies}/>
        </div>
      )}
    </div>
  );
};

interface CommentsProps {
  comments: CommentWithRepliesCount[];
  displayComments: boolean;
}

const Comments = ({ comments, displayComments }: CommentsProps) => {
  return (
    <div className={styles.comments}>
      {comments.map((comment, index) => {
        return (
          <Comment comment={comment} key={index} displayComment={displayComments} />
        );
      })}
    </div>
  );
};

export default Comments;
