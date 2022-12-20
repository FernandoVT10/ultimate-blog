import { toast } from "react-toastify";
import { PencilIcon } from "@primer/octicons-react";

import { ChangeEvent, useState } from "react";
import { BlogPost, updateCover } from "@services/BlogPostService";

import Image from "next/image";

import styles from "./Cover.module.scss";

// TODO: make a shared library or something to share this this with the one of the server's imageFilter
const ACCEPTED_IMAGE_TYPES = ["image/jpg", "image/jpeg", "image/png", "image/webp"];

const getURLFromFile = (file: File): Promise<string> => {
  return new Promise(resolve => {
    const reader = new FileReader();


    reader.onload = () => {
      resolve(reader.result as string);
    };

    reader.readAsDataURL(file);
  });
};

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
  const [updatedCover, setUpdatedCover] = useState<string | null>(null);

  const handleOnChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if(!e.target.files?.length) {
      return;
    }

    const file = e.target.files[0];

    if(!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("The uploaded file must be an image");
      return;
    }

    setLoading(true);

    const res = await updateCover(blogPostId, file);

    setLoading(false);

    if(res.error) {
      toast.error(res.error);
      return;
    }

    setUpdatedCover(await getURLFromFile(file));
    toast.success("Cover updated successfully");
  };

  const getCover = () => {
    if(updatedCover) {
      return (
        <img
          className={styles.updatedCoverImage}
          src={updatedCover}
          alt="Post cover"
        />
      );
    }

    return (
      <Image
        className={styles.coverImage}
        src={cover}
        alt="Post cover"
        fill
      />
    );
  };

  return (
    <div className={styles.cover}>
      {loading && 
        <div className={styles.loaderContainer}>
          <span className={styles.loader}></span>
          <p className={styles.text}>Uploading new cover</p>
        </div>
      }

      {isAdmin &&
        <div className={styles.changeCoverContainer}>
          <label
            className={styles.label}
            htmlFor="cover-image-input"
          >
            <PencilIcon size={14} className={styles.icon} />

            <p className={styles.helpText}>
              Upload a new cover
            </p>
          </label>

          <input
            type="file"
            id="cover-image-input"
            className={styles.inputFile}
            onChange={handleOnChange}
          />
        </div>
      }


      <div className={styles.coverImageContainer}>
        { getCover() }
      </div>
    </div>
  );
}
