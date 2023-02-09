import styles from "./TitleInput.module.scss";

// TODO: it's better to get this number from the BlogPost model of the server
const TITLE_MAX_LENGTH = 100;

interface TitleInputProps {
  title: string;
  setTitle: (title: string) => void
}

export default function TitleInput({
  title,
  setTitle
}: TitleInputProps) {
  return (
    <div className={styles.titleInput}>
      <input
        type="text"
        value={title}
        onChange={({ target: { value } }) => setTitle(value)}
        className={styles.input}
        maxLength={TITLE_MAX_LENGTH}
        autoComplete="off"
        required
      />
    </div>
  );
}
