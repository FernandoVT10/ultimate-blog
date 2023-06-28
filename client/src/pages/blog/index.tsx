import { BlogPost } from "@customTypes/collections";

import Head from "next/head";
import BlogHome from "@domain/BlogHome";

import catchServerErrors from "@utils/catchServerErrors";
import serverAxios from "@utils/serverAxios";

export const getServerSideProps = catchServerErrors(async () => {
  const blogPosts = await serverAxios.get("/blogposts");

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
