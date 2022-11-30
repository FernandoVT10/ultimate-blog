import { GetServerSideProps } from "next";
import { getAllPosts } from "../services/BlogPostService";

import Head from "next/head";
import BlogPosts from "@components/BlogPosts";

export const getServerSideProps: GetServerSideProps = async () => {
  const blogPosts = await getAllPosts();

  return {
    props: { blogPosts }
  };
};

type BlogPost = {
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface HomeProps {
  blogPosts: BlogPost[]
}

export default function Home({ blogPosts }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home - FVTBlog</title>
      </Head>

      <main>
        <BlogPosts blogPosts={blogPosts}/>
      </main>
    </>
  );
}
