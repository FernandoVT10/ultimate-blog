import { useEffect, useState } from "react";

import md from "@config/markdown";

import styles from "./MarkdownRenderer.module.scss";

export default function MarkdownRenderer({ markdown }: { markdown: string }) {
  const [renderedMarkdown, setRenderedMarkdown] = useState("");

  useEffect(() => {
    setRenderedMarkdown(md.render(markdown));
  }, [markdown]);

  return (
    <div className={styles.markdownRenderer}>
      <div dangerouslySetInnerHTML={{ __html: renderedMarkdown }}></div>
    </div>
  );
}
