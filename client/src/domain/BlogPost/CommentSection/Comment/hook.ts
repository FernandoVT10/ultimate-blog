import { Comment as Comment } from "@customTypes/collections";
import { useQuery } from "@hooks/api";

interface UseRepliesReturn {
  replies: Comment[] | null;
  loading: boolean;
  loadReplies: () => Promise<void>;
  addCreatedReply: (createdReply: Comment) => Promise<void>;
  removeDeletedReply: (replyId: string) => void;
}

export const useReplies = (commentId: string): UseRepliesReturn => {
  const {
    run: loadReplies,
    value: replies,
    setValue: setReplies,
    hasBeenCalled,
    loading
  } = useQuery<Comment[]>("/comments", {
    parentModel: "Comment",
    parentId: commentId
  }, { lazy: true });

  const addCreatedReply = async (createdReply: Comment) => {
    if(!hasBeenCalled) {
      await loadReplies();
    } else {
      setReplies([createdReply, ...replies || []]);
    }
  };

  const removeDeletedReply = (replyId: string) => {
    if(!replies) return;

    setReplies(replies.filter(reply => {
      return reply._id !== replyId;
    }));
  };

  const _loadReplies = async (): Promise<void> => {
    if(hasBeenCalled) return;
    await loadReplies();
  };

  return {
    replies,
    loading,
    loadReplies: _loadReplies,
    addCreatedReply,
    removeDeletedReply,
  };
};
