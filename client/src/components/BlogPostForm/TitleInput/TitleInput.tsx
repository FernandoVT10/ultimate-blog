import classNames from "classnames";

import styles from "./TitleInput.module.scss";

// TODO: it's better to get this number from the BlogPost model of the server
const TITLE_MAX_LENGTH = 100;

interface TitleProps {
  title: string;
  setTitle: (title: string) => void;
}

const TitleInput = ({ title, setTitle }: TitleProps) => {
  return (
    <div className={styles.titleInput}>
      <label htmlFor="title-input" className="custom-label">
        {"Title"}
      </label>

      <input
        type="text"
        id="title-input"
        value={title}
        placeholder="Write an amazing title"
        onChange={({ target: { value } }) => setTitle(value)}
        className={classNames("custom-input", styles.input)}
        maxLength={TITLE_MAX_LENGTH}
        autoComplete="off"
        required
      />
    </div>
  );
};

export default TitleInput;
