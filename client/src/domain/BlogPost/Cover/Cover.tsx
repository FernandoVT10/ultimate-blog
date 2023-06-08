import type { BlogPost } from "@customTypes/collections";

import CoverSelector, { CoverImage } from "@components/BlogPostForm/CoverSelector";
import { useMutation } from "@hooks/api";
import { serverErrorHandler } from "@utils/errorHandlers";
import { toast } from "react-toastify";

interface CoverProps {
  blogPostId: BlogPost["_id"];
  cover: BlogPost["cover"];
  isAdmin: boolean;
}

export default function Cover({
  cover,
  isAdmin,
  blogPostId
}: CoverProps) {
  const { run } = useMutation("put", `/blogposts/${blogPostId}/updateCover`, serverErrorHandler);

  const handleOnChange = async (cover: File): Promise<boolean> => {
    const formData = new FormData();
    formData.append("cover", cover);

    const res = await run(formData);
    
    if(res.success) {
      toast.success("Cover updated successfully");
    }

    return res.success;
  };

  if(!isAdmin) return <CoverImage coverURL={cover}/>;

  return (
    <CoverSelector
      coverURL={cover}
      onChangeCover={handleOnChange}
    />
  );
}
