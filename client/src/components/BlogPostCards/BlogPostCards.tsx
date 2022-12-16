import moment from "moment";

import Image from "next/image";
import Link from "next/link";

import { ClockFillIcon } from "@primer/octicons-react";
import { BlogPost } from "@services/BlogPostService";

import styles from "./BlogPostCards.module.scss";

interface BlogPostCardsProps {
  blogPosts: BlogPost[];
}

function BlogPostCard({ blogPost }: { blogPost: BlogPost }) {
  return (
    <div className={styles.blogPostCard}>
      <div className={styles.cover}>
        <Image
          src={blogPost.cover}
          className={styles.coverImage}
          alt={blogPost.title}
          fill
        />

        <div className={styles.date}>
          <ClockFillIcon className={styles.icon} size={12}/>
          { moment(blogPost.createdAt).fromNow() }
        </div>
      </div>

      <div className={styles.details}>
        <Link href={`/blog/${blogPost._id}`}>
          <h2 className={styles.title}>
            { blogPost.title }
          </h2>
        </Link>
      </div>
    </div>
  );
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
