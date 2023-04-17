import Cover from "./Cover";
import Title from "./Title";
import Content from "./Content";
import Tags from "./Tags";

import type { BlogPost as BlogPostType } from "@customTypes/collections";

import styles from "./BlogPost.module.scss";

const isAdmin = true;

interface BlogPostProps {
  blogPost: BlogPostType;
}

export default function BlogPost({ blogPost }: BlogPostProps) {
  return (
    <main className={styles.container}>
      <Cover
        cover={blogPost.cover}
        blogPostId={blogPost._id}
        isAdmin={isAdmin}
      />

      <section className={styles.contentContainer}>
        <Title
          title={blogPost.title}
          isAdmin={isAdmin}
          blogPostId={blogPost._id}
        />

        <Content
          blogPostId={blogPost._id}
          content={blogPost.content}
          isAdmin={isAdmin}
        />

        <Tags
          tags={blogPost.tags}
          isAdmin={isAdmin}
          blogPostId={blogPost._id}
        />
      {/**
        <DeleteButton
          isAdmin={isAdmin}
          title={blogPost.title}
          blogPostId={blogPost._id}
        />

        **/}
      </section>

      { /**recentBlogPosts.length &&
        <section className={styles.recentBlogPosts}>
          <h2 className={styles.subtitle}>Other Posts</h2>
          <BlogPostCards blogPosts={recentBlogPosts}/>
        </section>
      }**/}
    </main>
  );
}
