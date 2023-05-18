import Cover from "./Cover";
import Title from "./Title";
import Content from "./Content";
import Tags from "./Tags";
import DeleteButton from "./DeleteButton";
import BlogPostCards from "@components/BlogPostCards";

import { useAuthProvider } from "@providers/AuthProvider";

import type { BlogPost as BlogPostType } from "@customTypes/collections";

import styles from "./BlogPost.module.scss";

interface BlogPostProps {
  blogPost: BlogPostType;
  recentBlogPosts: BlogPostType[];
}

function BlogPost({ blogPost, recentBlogPosts }: BlogPostProps) {
  const authStatus = useAuthProvider();

  const isAdmin = authStatus.isLogged;

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
      </section>

      {isAdmin && (
        <section className={styles.dangerZone}>
          <h2 className={styles.subtitle}>Danger Zone</h2>

          <DeleteButton blogPostId={blogPost._id}/>
        </section>
      )}

      {recentBlogPosts.length > 0 && (
        <section className={styles.recentBlogPosts}>
          <h2>Other Posts</h2>
          <BlogPostCards blogPosts={recentBlogPosts}/>
        </section>
      )}
    </main>
  );
}

export default BlogPost;
