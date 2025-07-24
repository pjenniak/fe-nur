import { DashboardLayout } from "@/components/ui/layout/dashboard-layout";
import { api } from "@/config/api";
import { makeToast } from "@/helper/makeToast";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PLACEHOLDER } from "@/constant/image";
import formatDate from "@/helper/formatDate";
import { Input } from "@/components/ui/input";
import { Edit, Plus, SaveAll, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import formatRupiah from "@/helper/formatRupiah";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadImage } from "@/components/upload-image";
import { AlertConfirmation } from "@/components/modal-confirmation";
import { makeConfirm } from "@/helper/makeConfirm";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const ProdukPage = () => {
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
    isEditMode,
    onChangeOnTable,
    someEdited,
    onToggleEditMode,
    handleSaveAll,
    findData,
    loadingEditAll,
  } = useProduks();
  const TABLE_HEADERS = [
    "No",
    "",
    "Nama",
    "Kategori",
    "Harga",
    "HPP*",
    "Stok",
    "Terjual",
    "Terakhir Diubah",
    "",
  ];
  return (
    <DashboardLayout
      title="Produk"
      childredHeader={
        <div className="flex flex-row gap-2 items-center">
          {isEditMode && (
            <Button
              variant="default"
              className={
                someEdited
                  ? "bg-teal-500 text-white"
                  : "bg-gray-600 cursor-not-allowed"
              }
              onClick={handleSaveAll}
              disabled={!someEdited}
            >
              {loadingEditAll ? (
                <div className="animate-spin w-4 h-4 border-2 border-t-transparent rounded-full "></div>
              ) : (
                <SaveAll />
              )}
              Simpan
            </Button>
          )}
          <Button
            variant="outline"
            onClick={onToggleEditMode}
            className={cn(
              "w-24",
              isEditMode ? "bg-red-600 text-white" : "bg-blue-600 text-white"
            )}
          >
            <Edit />
            {isEditMode ? "Batal" : "Edit"}
          </Button>
          <Button variant="default" onClick={onClickAdd} className="w-24">
            <Plus />
            Tambah
          </Button>
        </div>
      }
    >
      <div className="relative w-full md:w-fit min-w-[300px]">
        <Input
          className="w-full"
          placeholder="Cari produk..."
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
              <TableRow key={item.produk_id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <img
                    src={item.foto_produk || PLACEHOLDER}
                    alt=""
                    width={200}
                    height={200}
                    className="min-w-12 min-h-12 w-12 h-12 object-cover rounded-xl"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {isEditMode ? (
                    <Input
                      value={findData(item.produk_id)?.nama_produk || ""}
                      onChange={(e) =>
                        onChangeOnTable(e, "nama_produk", item.produk_id)
                      }
                    />
                  ) : (
                    item.nama_produk
                  )}
                </TableCell>

                <TableCell>
                  {isEditMode ? (
                    <Input
                      value={findData(item.produk_id)?.kategori_produk || ""}
                      onChange={(e) =>
                        onChangeOnTable(e, "kategori_produk", item.produk_id)
                      }
                    />
                  ) : (
                    item.kategori_produk
                  )}
                </TableCell>

                <TableCell>
                  {isEditMode ? (
                    <Input
                      value={findData(item.produk_id)?.harga_produk || ""}
                      onChange={(e) =>
                        onChangeOnTable(e, "harga_produk", item.produk_id)
                      }
                    />
                  ) : (
                    formatRupiah(item.harga_produk)
                  )}
                </TableCell>
                <TableCell>{formatRupiah(item.hpp)}</TableCell>
                <TableCell>{item.jumlah_stok}</TableCell>
                <TableCell>{item.total_terjual}</TableCell>
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
          <TableCaption>
            *HPP dihitung dari rata rata harga pembelian
          </TableCaption>
        </Table>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] h-[90vh]">
          <form
            className="flex flex-col gap-4 overflow-auto"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <DialogHeader>
              <DialogTitle>
                {form.id ? "Edit Produk" : "Tambah Produk"}
              </DialogTitle>
              <DialogDescription>
                Isi form dibawah ini untuk{" "}
                {form.id ? "mengedit" : "menambahkan"} produk
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <UploadImage
                image={form.gambar}
                onChangeImage={(val) => setForm({ ...form, gambar: val })}
              />
              <div className="flex flex-col gap-2">
                <Label>Nama Produk</Label>
                <Input
                  placeholder="Bunga Matahari"
                  value={form.nama}
                  onChange={(e) => onChange(e, "nama")}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Kategori Produk</Label> 
                <Select
                  defaultValue={form.kategori}
                  onValueChange={(val) => setForm({ ...form, kategori: val })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tanaman Hias">Tanaman Hias</SelectItem>
                    <SelectItem value="Pot">Pot</SelectItem>
                    <SelectItem value="Obat">Obat</SelectItem>
                    <SelectItem value="Aksesoris">Aksesoris</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Harga Jual (Rp)</Label>
                <Input
                  placeholder="20000"
                  value={form.harga}
                  onChange={(e) => onChange(e, "harga")}
                  type="number"
                  onKeyDown={(evt) =>
                    ["e", "E", "+", "-"].includes(evt.key) &&
                    evt.preventDefault()
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Deskripsi</Label>
                <Textarea
                  value={form.deskripsi || ""}
                  onChange={(e) => onChange(e, "deskripsi")}
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

const useProduks = () => {
  const [data, setData] = useState([]);
  const [dataWithEdit, setDataWithEdit] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    id: "",
    harga: 0,
    kategori: "",
    nama: "",
    deskripsi: "",
    gambar: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loadingEditAll, setLoadingEditAll] = useState(false);

  const onClickItem = (item, isEdit) => {
    setForm({
      id: item.produk_id,
      harga: item.harga_produk,
      kategori: item.kategori_produk,
      nama: item.nama_produk,
      deskripsi: item.deskripsi_produk,
      gambar: item.foto_produk,
    });
    if (isEdit) setIsOpen(true);
  };

  const onClickAdd = () => {
    setForm({});
    setIsOpen(true);
  };

  const onChange = (e, key) => {
    setForm({
      ...form,
      [key]: e.target.value,
    });
  };

  const onChangeOnTable = (e, key, id) => {
    const newData = dataWithEdit.map((item) => {
      if (item.produk_id === id) {
        return {
          ...item,
          [key]: e.target.value,
          edited: true,
        };
      }
      return {
        ...item,
      };
    });
    setDataWithEdit(newData);
  };

  const filteredData = data.filter((item) =>
    item.nama_produk.toLowerCase().includes(search.toLowerCase())
  );

  const fetchData = async () => {
    try {
      const res = await api.get("/produk");
      setData(
        res.data.data.map((item) => ({
          ...item,
          edited: false,
        }))
      );
    } catch (error) {
      makeToast("error", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      console.log(form);
      Object.entries(form).forEach(([key, value]) => {
        if (!value && key !== "id" && key !== "gambar" && key !== "deskripsi") {
          throw new Error("Semua kolom harus diisi");
        }
      });
      if (pending) return;
      setPending(true);
      if (form.id) {
        setIsOpen(false);
        await makeConfirm(
          async () => await api.put(`/produk/${form.id}`, form)
        );
        await fetchData();
        makeToast("success", "Berhasil mengedit produk");
      } else {
        setIsOpen(false);
        await makeConfirm(async () => await api.post("/produk", form));
        await fetchData();
        makeToast("success", "Berhasil menambahkan produk");
      }
      setForm({});
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
      await makeConfirm(async () => await api.delete(`/produk/${form.id}`));
      await fetchData();
      makeToast("success", "Berhasil menghapus produk");
    } catch (error) {
      makeToast("error", error);
    } finally {
      setPending(false);
    }
  };

  const onToggleEditMode = () => {
    setDataWithEdit(
      data.map((item) => ({
        ...item,
        edited: false,
      }))
    );
    setIsEditMode(!isEditMode);
  };

  const someEdited = dataWithEdit.some((item) => item.edited);

  const findData = (id) => {
    const data = dataWithEdit.find((item) => item.produk_id === id);
    if (data) {
      return {
        ...data,
      };
    }
    return null;
  };

  const handleSaveAll = async () => {
    if (loadingEditAll) return;
    if (!dataWithEdit) return;
    await makeConfirm(async () => await promiseSaveAll());
  };

  const promiseSaveAll = async () => {
    try {
      setLoadingEditAll(true);
      const promises = [];
      for (let i = 0; i < dataWithEdit.length; i += 5) {
        const edited = dataWithEdit
          .slice(i, i + 5)
          .filter((item) => item.edited);
        console.log(`Saving ${edited.length} items`);
        promises.push(
          (async () => {
            for (const item of edited) {
              try {
                console.log(item.nama_produk, item.edited);
                const dto = {
                  id: item.produk_id,
                  nama: item.nama_produk,
                  kategori: item.kategori_produk,
                  harga: item.harga_produk,
                  deskripsi: item.deskripsi_produk,
                  gambar: item.foto_produk,
                };
                await api.put(`/produk/${item.produk_id}`, dto);
              } catch (error) {
                console.log(error);
                makeToast("error", error);
              }
            }
          })()
        );
      }
      await Promise.all(promises);
      await fetchData();
      makeToast("success", "Berhasil menyimpan semua perubahan");
    } catch (error) {
      console.log(error);
      makeToast("error", error);
    } finally {
      onToggleEditMode();
      setLoadingEditAll(false);
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
    onChangeOnTable,
    isEditMode,
    onToggleEditMode,
    someEdited,
    handleSaveAll,
    findData,
    loadingEditAll,
  };
};

export default ProdukPage;
