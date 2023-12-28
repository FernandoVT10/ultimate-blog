import type { BlogPost as BlogPostType } from "@customTypes/collections";

import MarkdownRenderer from "@components/MarkdownRenderer";
import Link from "next/link";
import Image from "next/image";

import styles from "./BlogPost.module.scss";
import BlogDate from "@components/BlogDate";

export default function BlogPost({ blogPost }: { blogPost: BlogPostType }) {
  return (
    <div className={styles.blogPost}>
      <div className={styles.coverContainer}>
        <Image
          className={styles.cover}
          src={blogPost.cover}
          alt="Post cover"
          sizes="(max-width: 1000px) 100vw, 1000px"
          fill
        />

        <div className={styles.details}>
          <Link href={`/blog/${blogPost._id}`}>
            <h2 className={styles.title}>
              { blogPost.title }
            </h2>
          </Link>

          <div className={styles.date}>
            <BlogDate createdAt={blogPost.createdAt}/>
          </div>
        </div>
      </div>

      <Link href={`/blog/${blogPost._id}`}>
        <div className={styles.body}>
          <div className={styles.content}>
            <MarkdownRenderer markdown={blogPost.content}/>
          </div>
        </div>
      </Link>
    </div>
  );
}
