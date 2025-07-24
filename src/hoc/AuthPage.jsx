import { useAuth } from "@/context/auth-context";
import { makeToast } from "@/helper/makeToast";
import { useNavigate } from "react-router-dom";

const AuthPage = ({ component: Component, auth }) => {
  const { user } = useAuth();
  const nav = useNavigate();
  if (user || auth === "all") {
    if (auth === "all") return <Component />;
    if (user?.peran[auth]) {
      return <Component />;
    } else {
      // makeToast("warning", "Anda tidak memiliki akses ke halaman ini");
      nav("/akun");
    }
  } else {
    makeToast("warning", "Anda belum login");
    nav("/login");
  }
  return null;
};

export default AuthPage;
