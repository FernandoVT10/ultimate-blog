import CreateBlogPostForm from "@domain/CreateBlogPostForm";
import Head from "next/head";

export default function CreateBlogPostPage() {
  return (
    <>
      <Head>
        <title>Create BlogPost - FVT</title>
      </Head>

      <main>
        <CreateBlogPostForm/>
      </main>
    </>
  );
}
