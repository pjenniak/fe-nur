import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardLayout } from "@/components/ui/layout/dashboard-layout";
import { Table, TableCell, TableRow } from "@/components/ui/table";
import { UploadImage } from "@/components/upload-image";
import { api } from "@/config/api";
import { useAuth } from "@/context/auth-context";
import { makeToast } from "@/helper/makeToast";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";

const AkunPage = () => {
  const { data, onChange, handleSubmit, setData } =
    useAkun();
  return (
    <DashboardLayout
      title="Akun"
      childredHeader={
        <Button onClick={handleSubmit}>
          <Save />
          Simpan
        </Button>
      }
    >
      <div className="w-full flex flex-col justify-start md:flex-row md:justify-between gap-4 relative">
        <div className="flex flex-col gap-4 w-full sticky top-0">
          <UploadImage
            isProfile
            className="mx-auto"
            image={data?.gambar}
            onChangeImage={(val) => {
              if (data) {
                setData({ ...data, gambar: val });
              }
            }}
          />
          {data?.gambar && (
            <Button
              className="w-fit mx-auto text-xs"
              variant="destructive"
              onClick={() => {
                const isConfirm = window.confirm(
                  "Apakah anda yakin ingin menghapus foto?"
                );
                if (isConfirm && data) {
                  setData({ ...data, gambar: null });
                }
              }}
            >
              Hapus Foto
            </Button>
          )}
          <div className="flex flex-col gap-2 w-full">
            <Label>Nama</Label>
            <Input
              value={data?.nama}
              placeholder="Loading.."
              onChange={(e) => onChange(e, "nama")}
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Label>Email</Label>
            <Input
              value={data?.email}
              placeholder="Loading.."
              onChange={(e) => onChange(e, "email")}
              type="email"
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Label>Jabatan / Peran</Label>
            <Input
              value={data?.peran?.nama_peran}
              placeholder="Loading.."
              disabled
            />
          </div>
        </div>
        
      </div>
    </DashboardLayout>
  );
};

AkunPage.auth = true;

const useAkun = () => {
  const [data, setData] = useState();
  const [pending, setPending] = useState(false);


  const { updateProfile } = useAuth();

  const onChange = (e, key) => {
    if (data) {
      setData({
        ...data,
        [key]: e.target.value,
      });
    }
  };

  const fetchData = async () => {
    try {
      const res = await api.get("/akun");
      setData({
        email: res.data.data.email,
        gambar: res.data.data.foto_profil,
        nama: res.data.data.nama_pengguna,
        user_id: res.data.data.user_id,
        peran: res.data.data.peran,
      });
    } catch (error) {
      makeToast("error", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      if (pending || !data) return;
      setPending(true);
      makeToast("info");
      const res = await api.put("/akun", data);
      updateProfile({
        email: res.data.data.email,
        foto_profil: res.data.data.foto_profil,
        nama_pengguna: res.data.data.nama_pengguna,
        peran: res.data.data.peran,
        user_id: res.data.data.user_id,
      });
      await fetchData();
      makeToast("success", "Berhasil mengedit akun");
    } catch (error) {
      makeToast("error", error);
    } finally {
      setPending(false);
    }
  };

  return {
    data,
    onChange,
    handleSubmit,
    setData,
  };
};

export default AkunPage;
