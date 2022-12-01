import moment from "moment";

import { ClockFillIcon } from "@primer/octicons-react";

import styles from "./BlogDate.module.scss";

export default function BlogDate({ createdAt }: { createdAt: string }) {
  return (
    <div className={styles.blogDate}>
      <ClockFillIcon className={styles.icon} size="small"/>
      Posted { moment(createdAt).fromNow() }
    </div>
  );
}
