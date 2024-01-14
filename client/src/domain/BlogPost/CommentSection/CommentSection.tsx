import { Comment as CommentType } from "@customTypes/collections";
import { useState } from "react";

import Comment from "./Comment";

import CommentForm from "./CommentForm";

interface CommentSectionProps {
  blogPostId: string;
  comments: CommentType[];
}

const CommentSection = ({ blogPostId, comments: initalComments }: CommentSectionProps) => {
  const [comments, setComments] = useState<CommentType[]>(initalComments);

  const addCreatedComment = (createdComment: CommentType) => {
    setComments([createdComment, ...comments]);
  };

  const removeDeletedComment = (deletedCommentId: string) => {
    setComments(comments.filter(comment => {
      return comment._id !== deletedCommentId;
    }));
  };

  return (
    <>
      <CommentForm
        parentModel="BlogPost"
        parentId={blogPostId}
        onCommentCreation={addCreatedComment}
      />

      <div>
        {comments.map((comment) => {
          return (
            <Comment
              comment={comment}
              onCommentDeletion={removeDeletedComment}
              key={comment._id}
              displayComment
            />
          );
        })}
      </div>
    </>
  );
};

export default CommentSection;
