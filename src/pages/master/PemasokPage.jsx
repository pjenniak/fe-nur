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
import { PLACEHOLDER } from "@/constant/image";
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
import { UploadImage } from "@/components/upload-image";
import { AlertConfirmation } from "@/components/modal-confirmation";
import { Link } from "react-router-dom";
import { makeConfirm } from "@/helper/makeConfirm";

const PemasokPage = () => {
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
    setForm,
    handleSubmit,
    handleDelete,
  } = usePemasoks();
  const TABLE_HEADERS = [
    "No",
    "Nama",
    "Alamat",
    "Telepon",
    "Terakhir Diubah",
    "",
  ];
  return (
    <DashboardLayout
      title="Pemasok"
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
          placeholder="Cari pemasok..."
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
              <TableRow key={item.pemasok_id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium">{item.nama_pemasok}</TableCell>
                <TableCell>{item.alamat_pemasok}</TableCell>
                <TableCell className="flex flex-row items-center gap-2">
                  {item.telepon_pemasok}
                  <Link to={`https://wa.me/${item.telepon_pemasok}`} target="_blank">
                    <ExternalLink className="w-4 h-4" />
                  </Link>
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
                {form.id ? "Edit Pemasok" : "Tambah Pemasok"}
              </DialogTitle>
              <DialogDescription>
                Isi form dibawah ini untuk{" "}
                {form.id ? "mengedit" : "menambahkan"} pemasok
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Nama Pemasok</Label>
                <Input
                  placeholder="Nama Pemasok"
                  value={form.nama}
                  onChange={(e) => onChange(e, "nama")}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Alamat</Label>
                <Input
                  placeholder="Sleman, Yogyakarta, Indonesia"
                  value={form.alamat}
                  onChange={(e) => onChange(e, "alamat")}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Telepon</Label>
                <Input
                  placeholder="62812345678"
                  value={form.telepon}
                  onChange={(e) => onChange(e, "telepon")}
                  type="number"
                  onKeyDown={(evt) =>
                    ["e", "E", "+", "-"].includes(evt.key) &&
                    evt.preventDefault()
                  }
                />
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

const initPemasokDTO = {
  id: "",
  nama: "",
  alamat: "",
  telepon: "",
  gambar: null,
};

const usePemasoks = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(initPemasokDTO);
  const [isOpen, setIsOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const onClickItem = (item, isEdit) => {
    setForm({
      id: item.pemasok_id,
      telepon: item.telepon_pemasok,
      alamat: item.alamat_pemasok,
      nama: item.nama_pemasok,
      gambar: item.logo_pemasok,
    });
    if (isEdit) setIsOpen(true);
  };

  const onClickAdd = () => {
    setForm(initPemasokDTO);
    setIsOpen(true);
  };

  const onChange = (e, key) => {
    setForm({
      ...form,
      [key]: e.target.value,
    });
  };

  const filteredData = data.filter((item) =>
    item.nama_pemasok.toLowerCase().includes(search.toLowerCase())
  );

  const fetchData = async () => {
    try {
      const res = await api.get("/pemasok");
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
        if (!value && key !== "id" && key !== "gambar") {
          throw new Error("Semua kolom harus diisi");
        }
        if (key === "telepon" && !value.startsWith("62")) {
          throw new Error("Nomor telepon harus dimulai dengan 62");
        }
      });
      if (pending) return;
      setPending(true);
      if (form.id) {
        setIsOpen(false);
        await makeConfirm(
          async () => await api.put(`/pemasok/${form.id}`, form)
        );
        await fetchData();
        makeToast("success", "Berhasil mengedit pemasok");
      } else {
        setIsOpen(false);
        await makeConfirm(async () => await api.post("/pemasok", form));
        await fetchData();
        makeToast("success", "Berhasil menambahkan pemasok");
      }
      setForm(initPemasokDTO);
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
      await makeConfirm(async () => await api.delete(`/pemasok/${form.id}`));
      await fetchData();
      makeToast("success", "Berhasil menghapus pemasok");
    } catch (error) {
      makeToast("error", error);
    } finally {
      setPending(false);
    }
  };

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
  };
};

export default PemasokPage;
