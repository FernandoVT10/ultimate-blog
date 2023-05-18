import axios from "@utils/axios";
import catchServerErrors from "@utils/catchServerErrors";

import type { BlogPost as BlogPostType } from "@customTypes/collections";

import Head from "next/head";
import Header from "@components/Header";
import BlogPost from "@domain/BlogPost";
import AuthProvider from "@providers/AuthProvider";

const BLOG_POSTS_FETCH_LIMIT = 3;

export const getServerSideProps = catchServerErrors(async ({ params }) => {
  const blogPostId = params?.blogId;

  if(!blogPostId) {
    return { notFound: true };
  }

  const blogPost = await axios.get<BlogPostType>(`/blogposts/${blogPostId}`);

  if(!blogPost) {
    return { notFound: true };
  }

  // TODO: instead of fetching recent posts, fetch related posts
  const recentBlogPosts = await axios.get("/blogposts/", {
    limit: BLOG_POSTS_FETCH_LIMIT
  });

  return { blogPost, recentBlogPosts };
});

interface BlogPageProps {
  blogPost: BlogPostType;
  recentBlogPosts?: BlogPostType[];
}

export default function BlogPostPage({ blogPost, recentBlogPosts }: BlogPageProps) {
  return (
    <>
      <Head>
        <title>{ blogPost.title }</title>
      </Head>

      <AuthProvider>
        <Header/>

        <BlogPost
          blogPost={blogPost}
          recentBlogPosts={recentBlogPosts || []}
        />
      </AuthProvider>
    </>
  );
}
