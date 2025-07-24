import { useAuth } from "@/context/auth-context";
import { makeToast } from "@/helper/makeToast";
import { useEffect } from "react";

const LogoutPage = () => {
  const { signOut } = useAuth();

  useEffect(() => {
    signOut();
    makeToast("success", "Berhasil logout");
  }, []);
  return null;
};

export default LogoutPage;
