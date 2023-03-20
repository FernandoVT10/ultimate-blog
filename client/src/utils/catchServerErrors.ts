/* eslint-disable @typescript-eslint/no-explicit-any */

import { GetServerSideProps, GetServerSidePropsContext } from "next";

type CatchServerErrors = (
  fn: (context: GetServerSidePropsContext) => Promise<any>
) => GetServerSideProps;

const catchServerErrors: CatchServerErrors = (fn) => async (context) => {
  try {
    const props = await fn(context);

    return { props };
  } catch (error) {
    // TODO: improve the way this error is handled
    console.error(error);

    return {
      props: {}
    };
  }
};

export default catchServerErrors;
