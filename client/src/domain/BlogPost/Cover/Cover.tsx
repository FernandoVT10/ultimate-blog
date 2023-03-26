import { useState } from "react";
import { toast } from "react-toastify";

import type { BlogPost } from "@customTypes/collections";

import CoverSelection from "@components/BlogPostForm/CoverSelection";

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
  const [loading, setLoading] = useState(false);

  const handleOnChange = async (cover: File) => {
    setLoading(true);

    // const res = await updateCover(blogPostId, cover);
    //
    // setLoading(false);
    //
    // if(res.error) {
    //   toast.error(res.error);
    //   return false;
    // }

    return true;
  };

  return (
    <CoverSelection
      loading={loading}
      coverURL={cover}
      displayChangeButton={isAdmin}
      onChangeCover={handleOnChange}
    />
  );
}
