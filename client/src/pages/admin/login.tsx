import Head from "next/head";

import LoginForm from "@domain/AdminLoginForm";

const LoginPage = () => {
  return (
    <>
      <Head>
        <title>Login - FVT</title>
      </Head>

      <LoginForm/>
    </>
  );
};

export default LoginPage;
