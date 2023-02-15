import { GetServerSideProps } from "next";
import { getAllPosts, BlogPost as BlogPostType } from "@services/BlogPostService";

import Head from "next/head";
import BlogPosts from "@domain/BlogHome/BlogPosts";
import Header from "@components/Header";

import styles from "@styles/pages/BlogHome.module.scss";

export const getServerSideProps: GetServerSideProps = async () => {
  const blogPosts = await getAllPosts();

  return {
    props: { blogPosts }
  };
};

interface HomeProps {
  blogPosts: BlogPostType[];
}

export default function BlogHome({ blogPosts }: HomeProps) {
  return (
    <>
      <Head>
        <title>FVT - Blog</title>
      </Head>

      <Header height={200}>
        <h1 className={styles.title}>FVT BLOG</h1>
      </Header>

      <main className={`wrapper ${styles.blogPostsContainer}`}>
        <BlogPosts blogPosts={blogPosts}/>
      </main>
    </>
  );
}
