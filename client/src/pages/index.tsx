import Head from "next/head";
import Home from "@domain/Home";
import serverAxios from "@utils/serverAxios";
import catchServerErrors from "@utils/catchServerErrors";

import type { BlogPost } from "@customTypes/collections";

const POSTS_FETCH_LIMIT = 6;

export const getServerSideProps = catchServerErrors(async () => {
  const blogPosts = await serverAxios.get("/blogposts", {
    limit: POSTS_FETCH_LIMIT
  });

  return { blogPosts };
});

export default function HomePage({ blogPosts }: { blogPosts?: BlogPost[] }) {
  return (
    <>
      <Head>
        <title>Home - FVT</title>
      </Head>

      <Home blogPosts={blogPosts || []}/>
    </>
  );
}
