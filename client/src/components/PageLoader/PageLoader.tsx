import Spinner from "@components/Spinner";

import styles from "./PageLoader.module.scss";

interface PageLoaderProps {
  loadingText: string;
}

const PageLoader = ({ loadingText }: PageLoaderProps) => {
  return (
    <div className={styles.pageLoader}>
      <Spinner size={80}/>
      <p className={styles.text}>{ loadingText }</p>
    </div>
  );
};

export default PageLoader;
