import { useState } from "react";
import { useMutation } from "@hooks/api";
import { serverErrorHandler } from "@utils/errorHandlers";
import { toast } from "react-toastify";

import type { Comment } from "@customTypes/collections";

import Button from "@components/Button";
import classNames from "classnames";

import styles from "./CommentForm.module.scss";

interface CommentForm {
  parentModel: Comment["parentModel"];
  parentId: Comment["parentId"];
  onCommentCreation: (createdComment: Comment) => void;
  showCancelButton?: boolean;
  cancelButtonOnClick?: () => void;
}

const CommentForm = ({
  parentModel,
  parentId,
  onCommentCreation,
  showCancelButton,
  cancelButtonOnClick
}: CommentForm) => {
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");

  const {
    run: addComment,
    loading
  } = useMutation<Comment>(
    "post",
    "/comments",
    serverErrorHandler
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      parentModel,
      parentId,
      authorName,
      content
    };

    const res = await addComment(data);

    if(res.success) {
      toast.success("Comment added successfully!");
      setAuthorName("");
      setContent("");

      if(res.data) onCommentCreation(res.data);
    }
  };

  return (
    <div className={styles.commentForm}>
      <form onSubmit={handleSubmit}>
        <div className={styles.authorNameContainer}>
          <label className={classNames(styles.label, "custom-label")}>
            {"Author Name"}
          </label>

          <input
            value={authorName}
            onChange={({ target: { value } }) => setAuthorName(value)}
            className="custom-input"
            placeholder="Write your beautiful name here"
            name="comment-authorname"
            required
          />
        </div>

        <textarea
          value={content}
          onChange={({ target: { value } }) => setContent(value)}
          placeholder="Write something..."
          className={classNames("custom-textarea", styles.contentTextarea)}
          name="comment-content"
          required
        />

        <div className={styles.buttons}>
          <Button
            type="submit"
            text="Add Comment"
            className={styles.addCommentButton}
            loading={loading}
          />

          {showCancelButton && (
            <Button
              type="button"
              className="secondary"
              text="Cancel"
              onClick={cancelButtonOnClick}
              disabled={loading}
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
