import moment from "moment";

import { FaClock } from "react-icons/fa";

import styles from "./BlogDate.module.scss";

export default function BlogDate({ createdAt }: { createdAt: string }) {
  return (
    <div className={styles.blogDate}>
      <FaClock className={styles.icon} size={14}/>
      Posted { moment(createdAt).fromNow() }
    </div>
  );
}
