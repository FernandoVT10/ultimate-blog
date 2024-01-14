import { Comment as CommentType } from "@customTypes/collections";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { useState } from "react";
import { useReplies } from "./hook";

import Spinner from "@components/Spinner";
import BaseComment from "./BaseComment";
import useToggler from "@hooks/useToggler";

import styles from "./Comment.module.scss";

// it's the same number inside of the CommentService file in the server project
const MAX_NEST_LEVEL = 3;

interface CommentProps {
  comment: CommentType;
  onCommentDeletion: (commentId: string) => void;
  displayComment: boolean;
}

const Comment = ({ comment, onCommentDeletion, displayComment }: CommentProps) => {
  const [isFormActive, setIsFormActive] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const {
    replies: repliesValue,
    loading,
    addCreatedReply,
    removeDeletedReply,
    loadReplies,
  } = useReplies(comment._id);

  const replies = repliesValue || [];

  const onReplyCreation = async (createdReply: CommentType) => {
    await addCreatedReply(createdReply);
    setIsFormActive(false);
    setShowReplies(true);
  };

  const handleShowReplies = async () => {
    if(!repliesValue) {
      await loadReplies();
      setShowReplies(true);
    } else {
      setShowReplies(!showReplies);
    }
  };

  const getReplies = () => {
    if(!replies.length) return;

    return (
      <div className={styles.replies}>
        {replies.map((reply) => {
          if(reply.level === MAX_NEST_LEVEL) {
            return (
              <LastNestedComment
                comment={reply}
                onCommentDeletion={removeDeletedReply}
                onCommentCreation={onReplyCreation}
                displayComment={showReplies}
                key={reply._id}
              />
            );
          }

          return (
            <Comment
              comment={reply}
              onCommentDeletion={removeDeletedReply}
              displayComment={showReplies}
              key={reply._id}
            />
          );
        })}
      </div>
    );
  };

  // if repliesValue is defined it means that we already have loaded the replies
  // therefore the replies length takes priority over the comment's replies count
  // why? because replies can be created and deleted changing the comment replies count
  const repliesCount = repliesValue ? repliesValue.length : comment.repliesCount || 0;

  if(!displayComment) {
    return null;
  }

  return (
    <div className={styles.commentContainer}>
      <BaseComment
        comment={comment}
        onCommentDeletion={onCommentDeletion}
        isFormActive={isFormActive}
        toggleIsFormActive={() => setIsFormActive(!isFormActive)}
        onReplyCreation={onReplyCreation}
        replyParentId={comment._id}
      />

      { repliesCount > 0 && (
        <>
          <button
            onClick={handleShowReplies}
            className={styles.showRepliesButton}
          >
            {showReplies
              ? ( <FaChevronUp className={styles.icon} size={14}/> )
              : ( <FaChevronDown className={styles.icon} size={14}/> )
            }
            {`${repliesCount} ${repliesCount > 1 ? "replies" : "reply"}`}
          </button>

          { loading && showReplies && (
            <div className={styles.loaderContainer}>
              <Spinner size={30}/>
            </div>
          )}

          { getReplies() }
        </>
      )}
    </div>
  );
};

interface LastNestedCommentProps {
  comment: CommentType;
  onCommentDeletion: (commentId: string) => void;
  onCommentCreation: (createdComment: CommentType) => void;
  displayComment: boolean;
}

const LastNestedComment = ({
  comment,
  onCommentDeletion,
  onCommentCreation,
  displayComment
}: LastNestedCommentProps) => {
  const [isFormActive, toggleIsFormActive] = useToggler(false);

  const onReplyCreation = (createdReply: CommentType) => {
    toggleIsFormActive();
    onCommentCreation(createdReply);
  };

  if(!displayComment) {
    return null;
  }

  return (
    <div className={styles.commentContainer}>
      <BaseComment
        comment={comment}
        onCommentDeletion={onCommentDeletion}
        isFormActive={isFormActive}
        toggleIsFormActive={toggleIsFormActive}
        onReplyCreation={onReplyCreation}
        replyParentId={comment.parentId}
      />
    </div>
  );
};

export default Comment;
