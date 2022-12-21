import styles from "./Spinner.module.scss";

interface SpinnerProps {
  size: number;
  borderWidth?: number;
  className?: string;
}
export default function Spinner({ size, borderWidth, className }: SpinnerProps) {
  return (
    <div
      className={`${styles.spinner} ${className}`}
      style={{ height: size, width: size, borderWidth: borderWidth || size / 10 }}
    ></div>
  );
}
