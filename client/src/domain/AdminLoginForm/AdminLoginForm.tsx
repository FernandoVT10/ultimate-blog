import { useState } from "react";
import { useMutation } from "@hooks/api";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { XCircleFillIcon } from "@primer/octicons-react";
import { getMessageFromAxiosError } from "@utils/formatters";
import { setAuthToken } from "@utils/authToken";

import Button from "@components/Button";
import styles from "./AdminLoginForm.module.scss";

interface LoginResult {
  token: string;
}

const AdminLoginForm = () => {
  const [password, setPassword] = useState("");

  const { loading, run: login, error } = useMutation<LoginResult>("post", "/admin/login");

  const router = useRouter();

  const handleSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();

    const res = await login({ password });

    if(res.success && res.data?.token) {
      setAuthToken(res.data.token);
      toast.success("Login successful");
      router.push("/");
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <h1 className={styles.title}>Login</h1>

          <input
            className="custom-input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={({ target: { value } }) => setPassword(value)}
            required
          />

          {error && 
            <div className="input-error">
              <XCircleFillIcon size={14} className="icon"/>
              <p className="message">{ getMessageFromAxiosError(error) }</p>
            </div>
          }

          <Button
            type="submit"
            text="Login"
            className={styles.submitButton}
            loadingText="Validating data"
            loading={loading}
          />
        </form>
      </div>
    </main>
  );
};

export default AdminLoginForm;
