import { getPostById, BlogPost, getAllPosts } from "@services/BlogPostService";

import { GetServerSideProps } from "next";
import { checkAdminStatus } from "@services/AdminService";
import { AUTH_COOKIE_KEY } from "@config/constants";

import Head from "next/head";
import Image from "next/image";
import BlogDate from "@components/BlogDate";
import Cover from "@domain/BlogPost/Cover";
import Title from "@domain/BlogPost/Title";
import Content from "@domain/BlogPost/Content";
import Tags from "@domain/BlogPost/Tags";
import Navbar from "@components/Navbar";
import BlogPostCards from "@components/BlogPostCards";

import styles from "@styles/Blog.module.scss";

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  const blogPostId = params?.blogId;

  if(!blogPostId) {
    return { notFound: true };
  }

  const blogPost = await getPostById(String(blogPostId));

  if(!blogPost) {
    return { notFound: true };
  }

  // TODO: I think is better to show related posts
  const recentBlogPosts = await getAllPosts();

  const authToken = req.cookies[AUTH_COOKIE_KEY];
  const isAdmin = await checkAdminStatus(authToken);

  return {
    props: { blogPost, isAdmin, recentBlogPosts }
  };
};

interface BlogPageProps {
  blogPost: BlogPost;
  recentBlogPosts: BlogPost[];
  isAdmin: boolean;
}

export default function BlogPage({ blogPost, recentBlogPosts, isAdmin }: BlogPageProps) {
  return (
    <>
      <Head>
        <title>{ blogPost.title }</title>
      </Head>

      <header className={styles.header}>
        <Navbar/>

        <Image
          src="/images/header-bg.jpg"
          alt="Header Image"
          className={styles.bg}
          fill
        />
      </header>

      <main className={`wrapper ${styles.blogPost}`}>
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

          <BlogDate createdAt={blogPost.createdAt}/>

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

        { recentBlogPosts.length &&
          <section className={styles.recentBlogPosts}>
            <h2 className={styles.subtitle}>Other Posts</h2>
            <BlogPostCards blogPosts={recentBlogPosts}/>
          </section>
        }
      </main>
    </>
  );
}
