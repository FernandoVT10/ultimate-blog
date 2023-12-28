import Spinner from "@components/Spinner";
import classNames from "classnames";

import { IconType } from "react-icons";

import styles from "./Button.module.scss";

interface ButtonProps {
  text: string;
  loadingText?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: () => any;
  show?: boolean;
  className?: string;
  icon?: IconType;
  loading?: boolean;
  type?: "submit" | "button";
  disabled?: boolean;
}

export default function Button({
  className,
  show,
  text,
  loadingText,
  icon: Icon,
  onClick,
  loading,
  type,
  disabled
}: ButtonProps) {
  if(show === false) return null;

  return (
    <button
      type={type || "button"}
      className={classNames("custom-btn", className, styles.button)}
      onClick={onClick}
      disabled={loading || disabled}
    >

    {loading ?
      <>
        <Spinner size={10} borderWidth={2} className={styles.loader}/>
        {loadingText || "Loading"}
      </>
    :
      <>
        { Icon && <Icon size={14} className={styles.icon} /> }
        {text}
      </>
    }
    </button>
  );
}
