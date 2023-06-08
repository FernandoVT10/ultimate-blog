import axios from "@utils/axios";
import catchServerErrors from "@utils/catchServerErrors";

import type {
  BlogPost as BlogPostType,
  Comment
} from "@customTypes/collections";

import Head from "next/head";
import Header from "@components/Header";
import BlogPost from "@domain/BlogPost";

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

  const comments = await axios.get<Comment[]>("/comments", {
    parentModel: "BlogPost",
    parentId: blogPost._id
  });

  // TODO: instead of fetching recent posts, fetch related posts
  const recentBlogPosts = await axios.get("/blogposts/", {
    limit: BLOG_POSTS_FETCH_LIMIT
  });

  return { blogPost, recentBlogPosts, comments };
});

interface BlogPageProps {
  blogPost: BlogPostType;
  recentBlogPosts?: BlogPostType[];
  comments: Comment[];
}

export default function BlogPostPage({
  blogPost,
  recentBlogPosts,
  comments
}: BlogPageProps) {
  return (
    <>
      <Head>
        <title>{ blogPost.title }</title>
      </Head>

      <Header/>

      <BlogPost
        blogPost={blogPost}
        recentBlogPosts={recentBlogPosts || []}
        comments={comments}
      />
    </>
  );
}
