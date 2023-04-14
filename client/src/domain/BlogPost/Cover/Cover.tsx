import type { BlogPost } from "@customTypes/collections";

import CoverSelector, { CoverImage } from "@components/BlogPostForm/CoverSelector";
import { useMutation } from "@hooks/api";
import { serverErrorHandler } from "@utils/errorHandlers";

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

    return await run(formData);
  };

  if(!isAdmin) return <CoverImage coverURL={cover}/>;

  return (
    <CoverSelector
      coverURL={cover}
      onChangeCover={handleOnChange}
    />
  );
}
