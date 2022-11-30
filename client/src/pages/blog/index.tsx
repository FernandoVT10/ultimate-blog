import { GetServerSideProps } from "next";
import { getAllPosts, BlogPost as BlogPostType } from "@services/BlogPostService";

import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import BlogPosts from "@domain/BlogHome/BlogPosts";

import styles from "@styles/BlogHome.module.scss";

export const getServerSideProps: GetServerSideProps = async () => {
  const blogPosts = await getAllPosts();

  return {
    props: { blogPosts }
  };
};

interface HomeProps {
  blogPosts: BlogPostType[]
}

export default function BlogHome({ blogPosts }: HomeProps) {
  return (
    <>
      <Head>
        <title>FVT - Blog</title>
      </Head>

      <header className={styles.header}>
        <Image
          src="/images/header-bg.jpg"
          alt="Header Image"
          className={styles.bg}
          fill
        />

        <h1 className={styles.title}>FVT BLOG</h1>
      </header>

      <main className={styles.blogPostsContainer}>
        <BlogPosts blogPosts={blogPosts}/>
      </main>

      <footer className={styles.footer}>
        <Link href="/blog" className={styles.brand}>
          FVT Blog
        </Link>
      </footer>
    </>
  );
}
