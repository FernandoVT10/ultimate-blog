import styles from "./Spinner.module.scss";

interface SpinnerProps {
  size: number;
}
export default function Spinner({ size }: SpinnerProps) {
  return (
    <div
      className={styles.spinner}
      style={{ height: size, width: size, borderWidth: size / 10 }}
    ></div>
  );
}
