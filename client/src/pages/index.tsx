import Head from "next/head";
import Home from "@domain/Home";
import axios from "@utils/axios";
import catchServerErrors from "@utils/catchServerErrors";

import type { BlogPost } from "@customTypes/collections";

const POSTS_FETCH_LIMIT = 6;

export const getServerSideProps = catchServerErrors(async () => {
  const blogPosts = await axios.get<BlogPost[]>("/blogposts", {
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
