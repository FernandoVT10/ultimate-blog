/* eslint-disable @next/next/no-img-element */

import { PencilIcon } from "@primer/octicons-react";
import { toast } from "react-toastify";
import { useState } from "react";

import Image from "next/image";
import Spinner from "@components/Spinner";

import styles from "./CoverSelection.module.scss";

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

interface CoverSelectionProps {
  displayChangeButton: boolean;
  onChangeCover: (cover: File) => Promise<boolean> | boolean;
  loading?: boolean;
  coverURL?: string;
}

export default function CoverSelection({
  loading,
  displayChangeButton,
  onChangeCover,
  coverURL
}: CoverSelectionProps) {
  const [updatedCover, setUpdatedCover] = useState<string | null>(null);

  const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if(!e.target.files?.length) {
      return;
    }

    const file = e.target.files[0];

    if(!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("The uploaded file must be an image");
      return;
    }

    if(await onChangeCover(file)) {
      setUpdatedCover(await getURLFromFile(file));
      toast.success("Cover updated successfully");
    }
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

    if(!coverURL) {
      return (
        <div className={styles.noCoverContainer}>
          <label
            className={styles.noCoverLabel}
            htmlFor="cover-image-input"
          >
            <p className={styles.helpText}>
              Click here to add a new cover
            </p>
          </label>
        </div>
      );
    }

    return (
      <Image
        className={styles.coverImage}
        src={coverURL}
        alt="Post cover"
        fill
        sizes="(max-width: 1200px) 100vw, 1200px"
        priority
      />
    );
  };

  return (
    <div className={styles.coverSelection}>
      {loading && 
        <div className={styles.loaderContainer}>
          <Spinner size={50}/>
          <p className={styles.text}>Uploading new cover</p>
        </div>
      }

      {displayChangeButton  &&
        <div className={styles.changeCoverContainer}>
          { (coverURL || updatedCover) && 
            <label
              className={styles.label}
              htmlFor="cover-image-input"
            >
              <PencilIcon size={14} className={styles.icon} />

              <p className={styles.helpText}>
                Upload a new cover
              </p>
            </label>
          }

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
