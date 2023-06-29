import { BlogPost } from "@customTypes/collections";

import Head from "next/head";
import BlogHome from "@domain/BlogHome";

import catchServerErrors from "@utils/catchServerErrors";
import axios from "@utils/axios";

export const getServerSideProps = catchServerErrors(async () => {
  const blogPosts = await axios.get<BlogPost[]>("/blogposts");

  return { blogPosts };
});

interface BlogHomePageProps {
  blogPosts?: BlogPost[];
}

export default function BlogHomePage({ blogPosts }: BlogHomePageProps) {
  return (
    <>
      <Head>
        <title>FVT - Blog</title>
      </Head>

      <BlogHome blogPosts={blogPosts || []}/>
    </>
  );
}
