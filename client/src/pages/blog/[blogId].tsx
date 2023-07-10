import axios from "@utils/axios";
import catchServerErrors from "@utils/catchServerErrors";

import type {
  BlogPost as BlogPostType,
  Comment
} from "@customTypes/collections";

import Head from "next/head";
import Header from "@components/Header";
import BlogPost from "@domain/BlogPost";

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

  return { blogPost, comments };
});

interface BlogPageProps {
  blogPost: BlogPostType;
  comments: Comment[];
}

export default function BlogPostPage({
  blogPost,
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
        comments={comments}
      />
    </>
  );
}
