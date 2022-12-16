import { GetServerSideProps } from "next";
import { getAllPosts, BlogPost as BlogPostType } from "@services/BlogPostService";

import Head from "next/head";
import Image from "next/image";
import Navbar from "@components/Navbar";
import BlogPosts from "@domain/BlogHome/BlogPosts";

import styles from "@styles/BlogHome.module.scss";

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

      <Navbar/>

      <header className={styles.header}>

        <Image
          src="/images/header-bg.jpg"
          alt="Header Image"
          className={styles.bg}
          fill
        />

        <h1 className={styles.title}>FVT BLOG</h1>
      </header>

      <main className={`wrapper ${styles.blogPostsContainer}`}>
        <BlogPosts blogPosts={blogPosts}/>
      </main>
    </>
  );
}
