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
import { Plus, Search } from "lucide-react";
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
import { PLACEHOLDER } from "@/constant/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { makeConfirm } from "@/helper/makeConfirm";

const CacatProdukPage = () => {
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
    onSelect,
    currentProduk,
    produks,
  } = useCacatProduks();
  const TABLE_HEADERS = [
    "No",
    "",
    "Produk",
    "Jumlah",
    "Alasan",
    "Terakhir Diubah",
    "",
  ];
  return (
    <DashboardLayout
      title="Cacat Produk"
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
          placeholder="Cari cacat produk..."
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
              <TableRow key={item.cacat_produk_id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <img
                    src={item?.produk?.foto_produk || PLACEHOLDER}
                    alt=""
                    width={200}
                    height={200}
                    className="min-w-12 min-h-12 w-12 h-12 object-cover rounded-xl"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {item?.produk?.nama_produk}
                </TableCell>
                <TableCell>{item?.jumlah_produk}</TableCell>
                <TableCell className="max-w-[200px]">{item?.alasan_kerusakan}</TableCell>
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
              <DialogTitle>{form.id ? "Edit Data" : "Tambah Data"}</DialogTitle>
              <DialogDescription>
                Isi form dibawah ini untuk{" "}
                {form.id ? "mengedit" : "menambahkan"} data cacat produk
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Produk</Label>
                <Select
                  onValueChange={(val) => onSelect(val, "produk_id")}
                  value={form.produk_id}
                  disabled={!!form.id}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Produk" />
                  </SelectTrigger>
                  <SelectContent>
                    {produks.map((item) => (
                      <SelectItem value={item.produk_id}>{item.nama_produk}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Jumlah Barang</Label>
                <Input
                  placeholder="10"
                  value={form.jumlah}
                  onChange={(e) => onChange(e, "jumlah")}
                  type="number"
                  onKeyDown={(evt) =>
                    ["e", "E", "+", "-"].includes(evt.key) &&
                    evt.preventDefault()
                  }
                />
                {form.produk_id && (
                  <div className="flex flex-col">
                    <span className="text-xs text-neutral-500">
                      Stok saat ini: {currentProduk}
                    </span>
                    {form.jumlah > currentProduk && (
                      <span className="text-xs text-red-500">
                        Stok tidak mencukupi
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label>Alasan Kerusakan</Label>
                <Textarea
                  value={form.alasan}
                  onChange={(e) => onChange(e, "alasan")}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={form.jumlah > currentProduk}>
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

const initCacatProdukDTO = {
  id: "",
  jumlah: 0,
  alasan: "",
  produk_id: "",
};

const useCacatProduks = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(initCacatProdukDTO);
  const [isOpen, setIsOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const onClickItem = (item, isEdit) => {
    setForm({
      id: item.cacat_produk_id,
      alasan: item.alasan_kerusakan,
      jumlah: item.jumlah_produk,
      produk_id: item.produk_id,
    });
    if (isEdit) setIsOpen(true);
  };

  const onClickAdd = () => {
    setForm(initCacatProdukDTO);
    setIsOpen(true);
  };

  const onSelect = (value, key) => {
    setForm({
      ...form,
      [key]: value,
    });
  };

  const onChange = (e, key) => {
    setForm({
      ...form,
      [key]: e.target.value,
    });
  };

  const filteredData = data.filter((item) =>
    item.produk.nama_produk.toLowerCase().includes(search.toLowerCase())
  );

  const fetchData = async () => {
    try {
      const res = await api.get("/cacat-produk");
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
          throw new Error("Semua kolom harus diisi");
        }
        if (key === "jumlah" && isNaN(Number(value))) {
          throw new Error("Jumlah harus berupa angka");
        }
      });
      if (pending) return;
      setPending(true);
      makeToast("info");
      if (form.id) {
        setIsOpen(false);
        await makeConfirm(async () => await api.put(`/cacat-produk/${form.id}`, form));        
        await Promise.all([fetchData(), fetchProduks()]);
        makeToast("success", "Berhasil mengedit data cacat produk");
      } else {
        setIsOpen(false);
        await makeConfirm(async () => await api.post("/cacat-produk", form));        
        await Promise.all([fetchData(), fetchProduks()]);
        makeToast("success", "Berhasil menambahkan data cacat produk");
      }
      setIsOpen(false);
      setForm(initCacatProdukDTO);
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
      await makeConfirm(async () => await api.delete(`/cacat-produk/${form.id}`));      
      await Promise.all([fetchData(), fetchProduks()]);
      makeToast("success", "Berhasil menghapus data cacat produk");
    } catch (error) {
      makeToast("error", error);
    } finally {
      setPending(false);
    }
  };

  const [produks, setProduks] = useState([]);

  const fetchProduks = async () => {
    try {
      const [res2] = await Promise.all([api.get("/produk")]);
      setProduks(res2.data.data);
    } catch (error) {
      makeToast("error", error);
    }
  };

  useEffect(() => {
    fetchProduks();
  }, []);

  const currentProduk =
    produks.find((item) => item.produk_id === form.produk_id)?.jumlah_stok || 0;

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
    onSelect,
    produks,
    currentProduk,
  };
};

export default CacatProdukPage;
