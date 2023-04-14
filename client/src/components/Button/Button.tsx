import Spinner from "@components/Spinner";
import classNames from "classnames";

import { IconProps } from "@primer/octicons-react";

import styles from "./Button.module.scss";

interface ButtonProps {
  show: boolean;
  text: string;
  loadingText?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: () => any;
  className?: string;
  icon?: React.FC<IconProps>;
  loading?: boolean;
  type?: "submit" | "button";
}

export default function Button({
  className,
  show,
  text,
  loadingText,
  icon: Icon,
  onClick,
  loading,
  type
}: ButtonProps) {
  if(!show) return null;

  return (
    <button
      type={type || "button"}
      className={classNames("custom-btn", className, styles.button)}
      onClick={onClick}
      disabled={loading}
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