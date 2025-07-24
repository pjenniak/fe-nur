import { Input } from "@/components/ui/input";
import { APP_NAME } from "../constant/index";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "@/config/api";
import { makeToast } from "@/helper/makeToast";
import { AxiosError } from "axios";

const ConfirmResetPasswordPage = () => {
  const { form, handleSubmit, onChange, errorMsg, isTokenError, fetching } =
    useConfirmResetPasswordPage();

  if (fetching) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="border border-gray-300 px-4  py-4 w-[90%] md:w-2/3 lg:w-1/3 xl:w-1/4 rounded-xl drop-shadow-md flex flex-col gap-4 bg-white">
          <h1 className="text-2xl text-black font-medium">Loading...</h1>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      {!isTokenError ? (
        <form
          className="border border-gray-300 px-4  py-4 w-[90%] md:w-2/3 lg:w-1/3 xl:w-1/4 rounded-xl drop-shadow-md flex flex-col gap-4 bg-white"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div>
            <h1 className="text-2xl text-black font-medium">
              Reset Kata Sandi
            </h1>
            <p className="text-sm">
              Masukkan kata sandi baru untuk email {form?.email}
            </p>
          </div>
          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
          <div className="flex flex-col gap-2">
            <Label>Kata Sandi</Label>
            <Input
              type="password"
              placeholder="Masukkan kata sandi baru"
              value={form?.password}
              onChange={(e) => onChange(e, "password")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Konfirmasi Kata Sandi</Label>
            <Input
              type="password"
              placeholder="Masukkan kata sandi baru"
              value={form?.confirmPassword}
              onChange={(e) => onChange(e, "confirmPassword")}
            />
          </div>
          <Button className="mt-2" type="submit">
            Reset
          </Button>
          <div className="flex flex-row items-center">
            <div className="w-full h-[1px] bg-gray-300" />
            <p className="px-2 text-xs flex-nowrap whitespace-nowrap text-center flex-1">
              Sudah punya akun?
            </p>
            <div className="w-full h-[1px] bg-gray-300" />
          </div>
          <Link to={"/login"} className="w-full">
            <Button variant="outline" className="w-full">
              Login
            </Button>
          </Link>
          <span className="text-xs text-gray-400 text-center">
            &copy; {APP_NAME} 2025
          </span>
        </form>
      ) : (
        <div className="border border-gray-300 px-4  py-4 w-[90%] md:w-2/3 lg:w-1/3 xl:w-1/4 rounded-xl drop-shadow-md flex flex-col gap-4 bg-white">
          <h1 className="text-2xl text-black font-medium">Reset Kata Sandi</h1>
          <p className="text-sm">Link tidak valid atau sudah kadaluarsa</p>
          <Link to={"/reset-password"} className="w-full">
            <Button variant="outline" className="w-full">
              Reset Kata Sandi Ulang
            </Button>
          </Link>
          <Link to={"/login"} className="w-full">
            <Button variant="outline" className="w-full">
              Kembali ke Login
            </Button>
          </Link>
          <span className="text-xs text-gray-400 text-center">
            &copy; {APP_NAME} 2025
          </span>
        </div>
      )}
    </div>
  );
};

const useConfirmResetPasswordPage = () => {
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
    token: "",
    email: "",
  });
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isTokenError, setIsTokenError] = useState(false);
  const navigate = useNavigate();

  const onChange = (e, key) => {
    setErrorMsg("");
    setForm({
      ...form,
      [key]: e.target.value,
    });
  };

  const fetchToken = async () => {
    try {
      const tokenFromUrl = new URLSearchParams(window.location.search).get(
        "token"
      );
      const res = await api.get(`/auth/reset-password/${tokenFromUrl}`);
      setForm({
        ...form,
        token: tokenFromUrl,
        email: res?.data?.data?.email,
      });
    } catch (error) {
      setIsTokenError(true);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchToken();
  }, []);

  const handleSubmit = async () => {
    try {
      if (loading || fetching) return;
      Object.values(form).forEach((value) => {
        if (!value) {
          throw new Error("Semua kolom harus diisi");
        }
      });

      if (form.password !== form.confirmPassword) {
        throw new Error("Password dan Konfirmasi Password tidak sama");
      }

      setLoading(true);
      makeToast("info");
      const res = await api.put("/auth/reset-password", {
        password: form.password,
        token: form.token,
      });
      makeToast("success", res?.data?.message);
      navigate("/login");
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrorMsg(error?.response?.data?.message);
      } else if (error instanceof Error) {
        setErrorMsg(error?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    onChange,
    handleSubmit,
    errorMsg,
    isTokenError,
    fetching,
  };
};

export default ConfirmResetPasswordPage;
