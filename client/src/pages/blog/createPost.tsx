import CreatePost from "@domain/CreatePost";
import Header from "@components/Header";
import Head from "next/head";

export default function CreateBlogPostPage() {
  return (
    <>
      <Head>
        <title>Create BlogPost - FVT</title>
      </Head>

      <Header/>

      <main className="wrapper">
        <CreatePost/>
      </main>
    </>
  );
}
