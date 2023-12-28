import { UseModalReturn } from "./hook";
import { FaTimes } from "react-icons/fa";

import styles from "./Modal.module.scss";

interface ModalProps {
  title: string,
  modal: UseModalReturn,
  children: JSX.Element
}

export default function Modal({ title, modal, children }: ModalProps) {
  const wrapperClass = modal.isActive ? styles.active : "";

  return (
    <div className={`${styles.modalWrapper} ${wrapperClass}`}>
      <div className={styles.modalContainer}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h2 className={styles.title}>{ title }</h2>

            <button
              className={styles.closeButton}
              onClick={() => modal.hideModal()}
            >
              <FaTimes size={20}/>
            </button>
          </div>

          <div className={styles.modalBody}>
            { children }
          </div>
        </div>
      </div>

      <div
        className={styles.clickableBackground}
        onClick={() => modal.hideModal()}
      ></div>
    </div>
  );
}
