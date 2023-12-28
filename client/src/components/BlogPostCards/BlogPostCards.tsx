import Image from "next/image";
import Link from "next/link";

import { ClockFillIcon } from "@primer/octicons-react";
import { dateToTimeAgo } from "@utils/formatters";

import type { BlogPost } from "@customTypes/collections";

import styles from "./BlogPostCards.module.scss";

function BlogPostCard({ blogPost }: { blogPost: BlogPost }) {
  return (
    <Link href={`/blog/${blogPost._id}`}>
      <div className={styles.blogPostCard}>
        <div className={styles.cover}>
          <Image
            src={blogPost.cover}
            className={styles.coverImage}
            alt={blogPost.title}
            sizes="(max-width: 1000px): 50vw, (max-width: 600): 100vw, 400px"
            fill
          />

          <div className={styles.date}>
            <ClockFillIcon className={styles.icon} size={12}/>
            { dateToTimeAgo(blogPost.createdAt) }
          </div>
        </div>

        <div className={styles.details}>
          <h2 className={styles.title}>
            { blogPost.title }
          </h2>
        </div>
      </div>
    </Link>
  );
}


interface BlogPostCardsProps {
  blogPosts: BlogPost[];
}

export default function BlogPostCards({ blogPosts }: BlogPostCardsProps) {
  return (
    <div className={styles.blogPostCards}>
      {blogPosts.map((blogPost, index) => {
        return <BlogPostCard blogPost={blogPost} key={index}/>;
      })}
    </div>
  );
}
