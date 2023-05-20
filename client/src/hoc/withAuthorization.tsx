import PageLoader from "@components/PageLoader";

import { useAuthProvider } from "@providers/AuthProvider";
import { useRouter } from "next/router";
import { useEffect } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any,react/display-name 
const withAuthorization = (Component: React.FC) => (props: any) => {
  const authStatus = useAuthProvider();
  const router = useRouter();

  useEffect(() => {
    if(!authStatus.loading && !authStatus.isLogged) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStatus.loading]);

  if(authStatus.loading) {
    return <PageLoader loadingText="Authenticating user"/>;
  }

  if(!authStatus.isLogged) {
    return null;
  }

  return (
    <Component {...props}/>
  );
};

export default withAuthorization;
