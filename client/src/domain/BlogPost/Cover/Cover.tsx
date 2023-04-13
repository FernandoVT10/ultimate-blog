import type { BlogPost } from "@customTypes/collections";

import CoverSelector, { CoverImage } from "@components/BlogPostForm/CoverSelector";
import { useMutation } from "@hooks/api";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

interface CoverProps {
  blogPostId: BlogPost["_id"];
  cover: BlogPost["cover"];
  isAdmin: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const serverErrorHandler = (error: any) => {
  if(error instanceof AxiosError && error.status === 500) {
    const message = error.response?.data.errors[0].message;
    return toast.error(message);
  }

  toast.error("Something went wrong. Try it later.");
};

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
