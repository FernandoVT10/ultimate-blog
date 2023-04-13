import axios from "@utils/axios";

import type { BlogPost as BlogPostType } from "@customTypes/collections";
// import { checkAdminStatusFromServer } from "@services/AdminService";
// import { AUTH_COOKIE_KEY } from "@config/constants";

import Head from "next/head";
import Header from "@components/Header";
import BlogPost from "@domain/BlogPost";

import catchServerErrors from "@utils/catchServerErrors";

// const BLOG_POSTS_FETCH_LIMIT = 3;

export const getServerSideProps = catchServerErrors(async ({ params, req }) => {
  const blogPostId = params?.blogId;

  if(!blogPostId) {
    return { notFound: true };
  }

  const blogPost = await axios.get<BlogPostType>(`/blogposts/${blogPostId}`);

  if(!blogPost) {
    return { notFound: true };
  }

  // const recentBlogPosts = await axios.get("/blogposts/", {
  //   limit: BLOG_POSTS_FETCH_LIMIT,
  //   excludePost: blogPost._id
  // });

  // const authToken = req.cookies[AUTH_COOKIE_KEY];
  // const isAdmin = await checkAdminStatusFromServer(authToken);

  // return { blogPost, isAdmin, recentBlogPosts };

  return { blogPost };
});

interface BlogPageProps {
  blogPost: BlogPostType;
  recentBlogPosts: BlogPostType[];
  isAdmin: boolean;
}

export default function BlogPostPage({ blogPost }: BlogPageProps) {
  return (
    <>
      <Head>
        <title>{ blogPost.title }</title>
      </Head>

      <Header/>

      <BlogPost blogPost={blogPost}/>
    </>
  );
}
