/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { PencilIcon } from "@primer/octicons-react";
import { toast } from "react-toastify";

import Spinner from "@components/Spinner";
import CoverImage from "./CoverImage";

import styles from "./CoverSelector.module.scss";

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


interface CoverSelectorProps {
  coverURL: string;
  onChangeCover: (cover: File) => Promise<boolean>;
}

export default function CoverSelector({ coverURL, onChangeCover }: CoverSelectorProps) {
  const [updatedCover, setUpdatedCover] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if(!e.target.files?.length) {
      return;
    }

    const file = e.target.files[0];

    if(!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("The uploaded file must be an image");
      return;
    }

    setLoading(true);

    if(await onChangeCover(file)) {
      setUpdatedCover(await getURLFromFile(file));
      toast.success("Cover updated successfully");
    }

    setLoading(false);
  };

  return (
    <div className={styles.coverSelector}>
      {loading && 
        <div className={styles.loader}>
          <Spinner size={50}/>
          <p className={styles.text}>Uploading new cover</p>
        </div>
      }

      <div className={styles.uploadContainer}>
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
          className={styles.input}
          onChange={handleChange}
        />
      </div>
      { updatedCover ?
        <img
          className={styles.updatedCover}
          src={updatedCover}
          alt="Post cover"
        />
      :
        <CoverImage coverURL={coverURL}/>
      }
    </div>
  );
}
