import { createContext, useContext } from "react";
import { useQuery } from "@hooks/api";

type AuthData = {
  isLogged: boolean;
  loading: boolean;
}

export const AuthContext = createContext<AuthData>({
  isLogged: false,
  loading: true
});

interface AuthProviderProps {
  children: React.ReactNode
}

const AuthProvider = (props: AuthProviderProps) => {
  const { value: authStatus, loading } = useQuery<{ isLogged: boolean }>("/admin/isLogged");

  const authData: AuthData = {
    loading,
    isLogged: authStatus?.isLogged || false
  };

  return <AuthContext.Provider value={authData} {...props}/>;
};

export const useAuthProvider = () => useContext(AuthContext);

export default AuthProvider;
