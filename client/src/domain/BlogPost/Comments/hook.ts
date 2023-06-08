import { useMemo, useState } from "react";
import { useQuery } from "@hooks/api";

import type { Comment as CommentType } from "@customTypes/collections";

import useToggler from "@hooks/useToggler";

const MAX_NEST_LEVEL = 3;

interface UseCommentHookReturn {
  isFormActive: boolean;
  toggleIsFormActive: () => void;
  showReplies: boolean;
  handleShowReplies: () => Promise<void>;
  getParentId: string;
  loading: boolean;
  hasReachedMaxLevel: boolean;
  replies: CommentType[] | null;
  handleCommentCreation: (createdComment: CommentType) => void;
}

export const useCommentHook = (comment: CommentType): UseCommentHookReturn => {
  const [isFormActive, toggleIsFormActive] = useToggler(false);
  const [showReplies, setShowReplies] = useState(false);
  
  const {
    run: loadReplies,
    value: replies,
    setValue: setReplies,
    loading
  } = useQuery<CommentType[]>("/comments", {
    parentModel: "Comment",
    parentId: comment._id
  }, { lazy: true });

  const hasReachedMaxLevel = comment.level >= MAX_NEST_LEVEL;

  const getParentId = useMemo<string>(() => {
    return hasReachedMaxLevel ? comment.parentId : comment._id;
  }, [comment, hasReachedMaxLevel]);

  const handleLoadReplies = async (): Promise<void> => {
    if(!loading && !replies) {
      await loadReplies();
    }
  };

  const handleShowReplies = async () => {
    setShowReplies(!showReplies);
    handleLoadReplies();
  };

  const handleCommentCreation = async (createdComment: CommentType): Promise<void> => {
    setShowReplies(true);
    toggleIsFormActive();

    if(replies) {
      setReplies([createdComment, ...(replies || [])]);
    } else {
      handleShowReplies();
    }
  };

  return {
    isFormActive,
    toggleIsFormActive,
    showReplies,
    handleShowReplies,
    getParentId,
    loading,
    hasReachedMaxLevel,
    replies,
    handleCommentCreation
  };
};
