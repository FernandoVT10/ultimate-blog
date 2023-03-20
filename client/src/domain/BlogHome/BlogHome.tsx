import type { BlogPost as BlogPostType } from "@customTypes/collections";

import Header from "@components/Header";
import BlogPost from "./BlogPost";

import styles from "./BlogHome.module.scss";

export default function BlogHome({ blogPosts }: { blogPosts: BlogPostType[] }) {
  const getBlogPosts = () => {
    if(blogPosts.length) {
      return blogPosts.map((blogPost, index) => {
        return <BlogPost key={index} blogPost={blogPost}/>;
      });
    }

    // TODO: display something prettier
    return (
      <div className={styles.messageContainer}>
        <p className={styles.message}>There are no blog posts.</p>
      </div>
    );
  };

  return (
    <>
      <Header height={200}>
        <h1>FVT BLOG</h1>
      </Header>

      <main className={styles.container}>
        { getBlogPosts() }
      </main>
    </>
  );
}
