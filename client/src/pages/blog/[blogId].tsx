import { getPostById, BlogPost } from "@services/BlogPostService";
import { GetServerSideProps } from "next";

import Head from "next/head";
import BlogDate from "@components/BlogDate";
import MarkdownRenderer from "@components/MarkdownRenderer";

import styles from "@styles/Blog.module.scss";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const blogPostId = params?.blogId;

  if(!blogPostId) {
    return { notFound: true };
  }

  const blogPost = await getPostById(String(blogPostId));

  if(!blogPost) {
    return { notFound: true };
  }

  return {
    props: { blogPost }
  };
};

export default function BlogPage({ blogPost }: { blogPost: BlogPost }) {
  return (
    <>
      <Head>
        <title>{ blogPost.title }</title>
      </Head>

      <main className={`wrapper ${styles.blogPost}`}>
        <img
          className={styles.cover}
          src={blogPost.cover}
          alt="Post cover"
        />

        <div className={styles.contentContainer}>
          <h1 className={styles.title}>{ blogPost.title }</h1>
          <BlogDate createdAt={blogPost.createdAt}/>

          <div className={styles.content}>
            <MarkdownRenderer markdown={blogPost.content}/>
          </div>
        </div>
      </main>
    </>
  );
}
