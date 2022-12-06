import moment from "moment";

import type { BlogPost as BlogPostType } from "@services/BlogPostService";
import { ClockFillIcon } from "@primer/octicons-react";

import MarkdownRenderer from "@components/MarkdownRenderer";
import Link from "next/link";

import styles from "./BlogPosts.module.scss";

function BlogPost({ blogPost }: { blogPost: BlogPostType }) {
  const getTags = () => {
    if(blogPost.tags.length) {
      return (
        <div className={styles.tags}>
          {blogPost.tags.map((tag, index) => {
            return (
              <Link
                className={styles.tag}
                href={`/blog?tags=${tag.name}`}
                key={index}
              >
                <span key={index}>
                  { tag.name }
                </span>
              </Link>
            );
          })}
        </div>
      );
    }
  };

  // TODO: when create blogPost is implemented, change img to next/image instead

  return (
    <div className={styles.blogPost}>
      <div className={styles.coverContainer}>
        <img
          className={styles.cover}
          src={blogPost.cover}
          alt="Post cover"
        />

        <div className={styles.details}>
          <Link href={`/blog/${blogPost._id}`}>
            <h2 className={styles.title}>
              { blogPost.title }
            </h2>
          </Link>

          <p className={styles.date}>
            <ClockFillIcon className={styles.icon} size="small"/>
            Posted { moment(blogPost.createdAt).fromNow() }
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

interface BlogPostsProps {
  blogPosts: BlogPostType[]
}

export default function BlogPosts({ blogPosts }: BlogPostsProps) {
  const getBlogPosts = () => {
    if(blogPosts.length) {
      return blogPosts.map((blogPost, index) => {
        return <BlogPost key={index} blogPost={blogPost}/>;
      });
    }
  };

  return (
    <div className={styles.blogPosts}>
      { getBlogPosts() }
    </div>
  );
}