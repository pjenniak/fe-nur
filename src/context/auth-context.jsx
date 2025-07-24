import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import Cookies from "js-cookie";
import { api } from "@/config/api";
import { makeToast } from "@/helper/makeToast";
import { APP_NAME } from "@/constant";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const fetchAuth = async () => {
    try {
      const res = await api.get("/auth/check");
      setUser(res.data.data);
      Cookies.set(APP_NAME, JSON.stringify(res.data.data), { expires: 0.5 });
      return res.data.data;
    } catch (error) {
      console.log(error);
      makeToast("error", error);
      return null;
    }
  };

  const ALLOWED_PATHS = ["/login", "/reset-password", "/", "/confirm-reset-password"];

  useEffect(() => {
    if (ALLOWED_PATHS.includes(pathname)) {
      return;
    }
    const userCookie = Cookies.get(APP_NAME);
    const decoded = userCookie ? JSON.parse(userCookie) : null;
    if (decoded && decoded.exp * 1000 > Date.now()) {
      setUser(decoded);
    } else {
      fetchAuth();
    }
  }, [pathname]);

  const updateProfile = (userData) => {
    if (user) {
      setUser({ ...user, ...userData });
      Cookies.set(APP_NAME, JSON.stringify({ ...user, ...userData }), {
        expires: 0.5,
      });
    }
  };

  const signOut = () => {
    setUser(null);
    Cookies.remove(APP_NAME);
    Cookies.remove("ACCESS_TOKEN");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, updateProfile, signOut, fetchAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
