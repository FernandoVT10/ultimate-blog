import type { BlogPost as BlogPostType, Tag } from "@customTypes/collections";

import { ClockFillIcon } from "@primer/octicons-react";
import { dateToTimeAgo } from "@utils/formatters";

import MarkdownRenderer from "@components/MarkdownRenderer";
import Link from "next/link";
import Image from "next/image";

import styles from "./BlogPost.module.scss";

function Tag({ tag }: { tag: Tag }) {
  return (
    <Link
      className={styles.tag}
      href={`/blog?tags=${tag.name}`}
    >
      { tag.name }
    </Link>
  );
}

export default function BlogPost({ blogPost }: { blogPost: BlogPostType }) {
  const getTags = () => {
    if(blogPost.tags.length) {
      return (
        <div className={styles.tags}>
          {blogPost.tags.map((tag, index) => {
            return <Tag tag={tag} key={index}/>;
          })}
        </div>
      );
    }
  };

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

          <p className={styles.date}>
            <ClockFillIcon className={styles.icon} size="small"/>
            Posted { dateToTimeAgo(blogPost.createdAt) }
          </p>
        </div>
      </div>

      { getTags() }

      <div className={styles.body}>
        <div className={styles.content}>
          <MarkdownRenderer markdown={blogPost.content}/>
        </div>
      </div>
    </div>
  );
}
