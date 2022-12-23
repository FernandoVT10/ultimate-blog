import { getPostById, BlogPost } from "@services/BlogPostService";

import { GetServerSideProps } from "next";
import { checkAdminStatus } from "@services/AdminService";
import { AUTH_COOKIE_KEY } from "@config/constants";

import Head from "next/head";
import BlogDate from "@components/BlogDate";
import Cover from "@domain/BlogPost/Cover";
import Title from "@domain/BlogPost/Title";
import Content from "@domain/BlogPost/Content";
import Tags from "@domain/BlogPost/Tags";

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

  const authToken = req.cookies[AUTH_COOKIE_KEY];

  const isAdmin = await checkAdminStatus(authToken);

  return {
    props: { blogPost, isAdmin }
  };
};

interface BlogPageProps {
  blogPost: BlogPost;
  isAdmin: boolean;
}

export default function BlogPage({ blogPost, isAdmin }: BlogPageProps) {
  return (
    <>
      <Head>
        <title>{ blogPost.title }</title>
      </Head>

      <main className={`wrapper ${styles.blogPost}`}>
        <Cover
          cover={blogPost.cover}
          blogPostId={blogPost._id}
          isAdmin={isAdmin}
        />

        <div className={styles.contentContainer}>
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

          <Tags tags={blogPost.tags} isAdmin={isAdmin}/>
        </div>
      </main>
    </>
  );
}
