import { Input } from "@/components/ui/input";
import { APP_NAME } from "../constant/index";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "@/config/api";
import { makeToast } from "@/helper/makeToast";

const ResetPasswordPage = () => {
  const { form, handleSubmit, onChange } = useResetPassword();
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <form
        className="border border-gray-300 px-4  py-4 w-[90%] md:w-2/3 lg:w-1/3 xl:w-1/4 rounded-xl drop-shadow-md flex flex-col gap-4 bg-white"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div>
          <h1 className="text-2xl text-black font-medium">Reset Kata Sandi</h1>
          <p className="text-sm">Masukkan email untuk ganti ulang kata sandi</p>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Email</Label>
          <Input
            type="email"
            placeholder={`example@${APP_NAME?.replace(
              " ",
              ""
            ).toLowerCase()}.com`}
            value={form.email}
            onChange={(e) => onChange(e, "email")}
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
    </div>
  );
};

const useResetPassword = () => {
  const [form, setForm] = useState({ email: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e, key) => {
    setForm({
      ...form,
      [key]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (loading) return;
      Object.values(form).forEach((value) => {
        if (!value) {
          throw new Error("Semua kolom harus diisi");
        }
      });
      setLoading(true);
      makeToast("info");
      const res = await api.post("/auth/reset-password", form);
      makeToast("success", res?.data?.message);
      navigate("/login");
    } catch (error) {
      console.log(error)
      makeToast("error", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    onChange,
    handleSubmit,
  };
};

export default ResetPasswordPage;
