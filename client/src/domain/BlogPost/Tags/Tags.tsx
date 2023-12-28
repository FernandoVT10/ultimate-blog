import { useState } from "react";
import { toast } from "react-toastify";
import { BlogPost, Tag } from "@customTypes/collections";
import { FaFolder } from "react-icons/fa";
import { useMutation } from "@hooks/api";
import { serverErrorHandler } from "@utils/errorHandlers";

import TagEditor, { getNamesFromTags } from "@components/BlogPostForm/TagEditor";
import TagBadgets from "@components/BlogPostForm/TagEditor/TagBadgets";
import Button from "@components/Button";
import Spinner from "@components/Spinner";

import styles from "./Tags.module.scss";

interface TagsProps {
  tags: Tag[];
  isAdmin: boolean;
  blogPostId: BlogPost["_id"];
}

export default function Tags({ tags: initialSelectedTags, isAdmin, blogPostId }: TagsProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(
    getNamesFromTags(initialSelectedTags)
  );

  const { loading, run: updateTags } = useMutation(
    "put",
    `/blogposts/${blogPostId}/updateTags`,
    serverErrorHandler
  );

  const handleUpdateTags = async () => {
    const res = await updateTags({ tags: selectedTags });

    if(res.success) {
      toast.success("Tags updated successfully");
    }
  };


  if(!isAdmin) {
    if(!initialSelectedTags.length) return null;

    return (
      <div className={styles.tags}>
        <TagBadgets tags={getNamesFromTags(initialSelectedTags)}/>
      </div>
    );
  }

  const updateButton = (
    <Button
      text="Update Tags"
      icon={FaFolder}
      onClick={handleUpdateTags}
    />
  );

  return (
    <div className={styles.container}>
      {loading && (
        <div className={styles.loader}>
          <Spinner size={50}/>
        </div>
      )}

      <TagEditor
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        optionalButton={updateButton}
      />
    </div>
  );
}
