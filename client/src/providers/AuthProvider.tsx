import { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@hooks/api";

type AuthData = {
  isLogged: boolean;
}

const initialData: AuthData = {
  isLogged: false
};

export const AuthContext = createContext<AuthData>(initialData);

interface AuthProviderProps {
  children: React.ReactNode
}

const AuthProvider = (props: AuthProviderProps) => {
  const [authData, setAuthData] = useState(initialData);
  const { value: authStatus } = useQuery<{ isLogged: boolean }>("/admin/isLogged");

  useEffect(() => {
    if(authStatus) setAuthData({ isLogged: authStatus.isLogged });
  }, [authStatus]);

  return <AuthContext.Provider value={authData} {...props}/>;
};

export const useAuthProvider = () => useContext(AuthContext);

export default AuthProvider;
