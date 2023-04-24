import { GetServerSideProps } from "next";
// import { checkAdminStatusFromServer } from "@services/AdminService";
// import { AUTH_COOKIE_KEY } from "@config/constants";

import CreatePost from "@domain/CreatePost";
import Header from "@components/Header";
import Head from "next/head";

// TODO: implement this when proper authentication system is created
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  // const authToken = req.cookies[AUTH_COOKIE_KEY];
  // const isAdmin = await checkAdminStatusFromServer(authToken);
  //
  // if(!isAdmin) {
  //   return {
  //     redirect: {
  //       permanent: false,
  //       destination: "/"
  //     },
  //     props: {}
  //   };
  // }

  return {
    props: {}
  };
};

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
