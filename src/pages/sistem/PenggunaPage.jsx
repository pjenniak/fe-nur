import { DashboardLayout } from "@/components/ui/layout/dashboard-layout";
import { api } from "@/config/api";
import { makeToast } from "@/helper/makeToast";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import formatDate from "@/helper/formatDate";
import { Input } from "@/components/ui/input";
import { ExternalLink, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AlertConfirmation } from "@/components/modal-confirmation";
import { Link } from "react-router-dom";
import { PROFILE } from "@/constant/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { makeConfirm } from "@/helper/makeConfirm";

const PenggunaPage = () => {
  const {
    filteredData,
    search,
    setSearch,
    onClickItem,
    setIsOpen,
    form,
    onChange,
    isOpen,
    onClickAdd,
    handleSubmit,
    handleDelete,
    onChangePeran,
    perans,
  } = usePenggunas();
  
  const TABLE_HEADERS = [
    "No",
    "",
    "Nama",
    "Email",
    "Jabatan",
    "Terakhir Diubah",
    "",
  ];

  return (
    <DashboardLayout
      title="Pengguna"
      childredHeader={
        <Button variant="default" onClick={onClickAdd}>
          <Plus />
          Tambah
        </Button>
      }
    >
      <div className="relative w-full md:w-fit min-w-[300px]">
        <Input
          className="w-full"
          placeholder="Cari pengguna..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
      </div>
      <div className="relative overflow-x-auto w-full">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              {TABLE_HEADERS.map((header, index) => (
                <TableHead key={index} className="">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item, index) => (
              <TableRow key={item.user_id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <img
                    src={item.foto_profil || PROFILE}
                    alt=""
                    width={200}
                    height={200}
                    className="min-w-12 min-h-12 w-12 h-12 object-cover rounded-xl"
                  />
                </TableCell>
                <TableCell className="font-medium">{item.nama_pengguna}</TableCell>
                <TableCell className="flex flex-row items-center gap-2">
                  {item.email}
                  <Link to={`mailto:${item.kode}`} target="_blank">
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </TableCell>
                <TableCell className="font-medium">
                  {item?.peran?.nama_peran}
                </TableCell>
                <TableCell>{formatDate(item.updated_at, true, true)}</TableCell>
                <TableCell className="flex flex-row gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => onClickItem(item, true)}
                  >
                    Edit
                  </Button>
                  <AlertConfirmation
                    trigger={
                      <Button
                        variant="destructive"
                        onClick={() => onClickItem(item)}
                      >
                        Hapus
                      </Button>
                    }
                    onConfirm={handleDelete}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <DialogHeader>
              <DialogTitle>
                {form.id ? "Edit Pengguna" : "Tambah Pengguna"}
              </DialogTitle>
              <DialogDescription>
                Isi form dibawah ini untuk{" "}
                {form.id ? "mengedit" : "menambahkan"} pengguna
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Nama Pengguna</Label>
                <Input
                  placeholder="Eren Yeager"
                  value={form.nama}
                  onChange={(e) => onChange(e, "nama")}
                  disabled={!!form.id}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Email</Label>
                <Input
                  placeholder="pengguna@example.com"
                  value={form.email}
                  onChange={(e) => onChange(e, "email")}
                  disabled={!!form.id}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Jabatan / Peran</Label>
                <Select onValueChange={onChangePeran} value={form.peran_id}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Jabatan / Peran" />
                  </SelectTrigger>
                  <SelectContent>
                    {perans.map((item) => (
                      <SelectItem value={item.peran_id} key={item.peran_id}>
                        {item.nama_peran}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Simpan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

const initPenggunaDTO = {
  id: "",
  nama: "",
  email: "",
  peran_id: "",
};

const usePenggunas = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(initPenggunaDTO);
  const [isOpen, setIsOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const onClickItem = (item, isEdit) => {
    setForm({
      id: item.user_id,
      nama: item.nama_pengguna,
      email: item.email,
      peran_id: item.peran.peran_id,
    });
    if (isEdit) setIsOpen(true);
  };

  const onClickAdd = () => {
    setForm(initPenggunaDTO);
    setIsOpen(true);
  };

  const onChangePeran = (value) => {
    setForm({
      ...form,
      peran_id: value,
    });
  };

  const onChange = (e, key) => {
    setForm({
      ...form,
      [key]: e.target.value,
    });
  };

  const filteredData = data.filter((item) =>
    item.nama_pengguna.toLowerCase().includes(search.toLowerCase())
  );

  const fetchData = async () => {
    try {
      const res = await api.get("/pengguna");
      setData(res.data.data);
    } catch (error) {
      makeToast("error", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      Object.entries(form).forEach(([key, value]) => {
        if (!value && key !== "id") {
          console.log(key, value);
          throw new Error("Semua kolom harus diisi");
        }
        if (
          key === "email" &&
          !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
        ) {
          throw new Error("Harus berupa email valid");
        }
      });
      if (pending) return;
      setPending(true);
      if (form.id) {
        setIsOpen(false);
        await makeConfirm(
          async () => await api.put(`/pengguna/${form.id}`, form)
        );
        await fetchData();
        makeToast("success", "Berhasil mengedit pengguna");
      } else {
        setIsOpen(false);
        await makeConfirm(async () => await api.post(`/pengguna`, form));
        await fetchData();
        makeToast("success", "Berhasil menambahkan pengguna");
      }
      setForm(initPenggunaDTO);
    } catch (error) {
      makeToast("error", error);
    } finally {
      setPending(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (!form.id) return;
      if (pending) return;
      setPending(true);
      await makeConfirm(async () => await api.delete(`/pengguna/${form.id}`));
      await fetchData();
      makeToast("success", "Berhasil menghapus pengguna");
    } catch (error) {
      makeToast("error", error);
    } finally {
      setPending(false);
    }
  };

  const [perans, setPerans] = useState([]);

  const fetchPerans = async () => {
    try {
      const res = await api.get("/peran");
      setPerans(res.data.data);
    } catch (error) {
      makeToast("error", error);
    }
  };

  useEffect(() => {
    fetchPerans();
  }, []);

  return {
    filteredData,
    search,
    setSearch,
    onClickItem,
    setIsOpen,
    form,
    onChange,
    isOpen,
    onClickAdd,
    setForm,
    handleSubmit,
    handleDelete,
    onChangePeran,
    perans,
  };
};

export default PenggunaPage;
