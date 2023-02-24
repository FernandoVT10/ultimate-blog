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
          sizes="(max-width: 1000px): 50vw, (max-width: 600): 100vw, 400px"
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
  const threePostsClassName = blogPosts.length === 3 && styles.threePosts;

  return (
    <div className={`${styles.blogPostCards} ${threePostsClassName}`}>
      {blogPosts.map((blogPost, index) => {
        return <BlogPostCard blogPost={blogPost} key={index}/>;
      })}
    </div>
  );
}
