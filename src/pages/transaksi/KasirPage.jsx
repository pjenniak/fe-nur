import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardLayout } from "@/components/ui/layout/dashboard-layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/config/api";
import { PLACEHOLDER } from "@/constant/image";
import formatRupiah from "@/helper/formatRupiah";
import { makeConfirm } from "@/helper/makeConfirm";
import { makeToast } from "@/helper/makeToast";
import useDebounce from "@/hooks/use-debounce";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const initPesananDTO = {
  metode: "Cash",
  kode: null,
  deskripsi: null,
};

const KasirPage = () => {
  const {
    filteredData,
    search,
    setSearch,
    form,
    items,
    onDecrease,
    onAddCart,
    setForm,
    onIncrease,
    fetching,
    isOpen,
    pelanggan,
    setIsOpen,
    setFetching,
    discount,
    percentageDisc,
    percentageTax,
    subTotal,
    tax,
    total,
    handleSubmit,
    isCreateNew,
    name,
    onCreateMember,
    setIsCreateNew,
    setName,
  } = useKasir();

  return (
    <DashboardLayout
      title="Buat Pesanan"
      childredHeader={
        <Button
          onClick={() => {
            if (!items.length) {
              makeToast("error", "Pesanan tidak boleh kosong");
            } else {
              setIsOpen(true);
            }
          }}
        >
          Buat Pesanan
        </Button>
      }
    >
      <div className="flex flex-col lg:flex-row gap-4 justify-start md:justify-between">
        <div className="border-input rounded-md border bg-transparent p-4 text-base shadow-xs transition-[color,box-shadow] outline-none flex flex-col gap-4 overflow-auto w-full lg:w-1/2 xl:w-2/3">
          <h2 className="text-2xl font-bold">Pilih Produk</h2>
          <div className="relative w-full md:w-fit min-w-[300px]">
            <Input
              className="w-full"
              placeholder="Cari produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          <div className="flex flex-col gap-4">
            {filteredData.map((kat) => (
              <div className="flex flex-col gap-2" key={kat.kategori}>
                <div className="font-medium">{kat.kategori}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {kat.produks.map((prod) => (
                    <div
                      key={prod.produk_id}
                      className="border-input rounded-md border bg-transparent p-4 text-base shadow-xs transition-[color,box-shadow] outline-none flex flex-col gap-4 overflow-auto w-full"
                    >
                      <img
                        src={prod.foto_produk || PLACEHOLDER}
                        width={600}
                        height={400}
                        className="w-full aspect-video rounded-xl drop-shadow-sm object-cover"
                      />
                      <div className="flex flex-col">
                        <h2 className="line-clamp-1">{prod.nama_produk}</h2>
                        <p className="text-sm">{prod.kategori_produk}</p>
                        <p className="text-sm">
                          {formatRupiah(prod.harga_produk)}
                        </p>
                        <span className="text-xs text-gray-500">
                          Stok : {prod.jumlah_stok}
                        </span>
                      </div>
                      <Button onClick={() => onAddCart(prod)}>Tambah</Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-input rounded-md border bg-transparent p-4 text-base shadow-xs transition-[color,box-shadow] outline-none flex flex-col gap-4 overflow-auto w-full lg:w-1/2 xl:w-1/3 sticky top-0 h-fit">
          <h2 className="text-2xl font-bold">Pesanan</h2>
          {items.length ? (
            items.map((item) => (
              <div
                className="w-full h-fit border-input rounded-md border bg-transparent p-4 text-base shadow-xs transition-[color,box-shadow] outline-none flex flex-col gap-4"
                key={item.produk_id}
              >
                <div className="flex flex-row gap-4 items-center">
                  <img
                    src={item.produk_gambar || PLACEHOLDER}
                    width={300}
                    height={300}
                    className="w-24 aspect-square rounded-xl drop-shadow-sm object-cover"
                  />
                  <div className="flex flex-col w-full">
                    <p className="text-base line-clamp-1">{item.produk_nama}</p>
                    <p className="text-sm line-clamp-1">
                      {item.produk_kategori}
                    </p>
                    <p className="text-sm line-clamp-1">
                      {formatRupiah(item.produk_harga)} x{item.jumlah}
                    </p>
                    <div className="flex flex-row w-full gap-2 justify-between text-xs mt-2">
                      <Button
                        className="w-1/2"
                        variant="destructive"
                        onClick={() => onDecrease(item)}
                      >
                        -
                      </Button>
                      <Button
                        className="w-1/2"
                        onClick={() => onIncrease(item)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-xs text-center">
              Belum ada produk ditambahkan
            </p>
          )}
        </div>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="overflow-auto h-[80vh]">
          <DialogHeader>
            <DialogTitle>Buat Pesanan</DialogTitle>
            <DialogDescription>
              Lengkapi data pesanan di bawah!
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Metode</Label>
              <Select
                onValueChange={(val) => setForm({ ...form, metode: val })}
                value={form.metode}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Metode Pembayaran" />
                </SelectTrigger>
                <SelectContent>
                  {["Cash", "VirtualAccountOrBank"].map((item) => (
                    <SelectItem value={item} key={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>{isCreateNew ? "Nomor Telepon / Email" : "Member"}</Label>
              <Input
                placeholder="6285123456789"
                value={form.kode || ""}
                onChange={(e) => {
                  if (e.target.value !== "") {
                    setFetching(true);
                  }
                  setForm({ ...form, kode: e.target.value });
                }}
              />
              {!isCreateNew && fetching && form.kode && (
                <div className="text-xs">
                  {fetching && form.kode
                    ? "Sedang mencari pelanggan"
                    : pelanggan && form.kode
                    ? pelanggan.nama_pelanggan
                    : !form.kode
                    ? ""
                    : "Tidak terdaftar"}
                </div>
              )}
            </div>
            {isCreateNew && (
              <div className="flex flex-col gap-2">
                <Label>Nama</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Eren Yeager"
                />
              </div>
            )}
            {!isCreateNew ? (
              <Button
                onClick={() => setIsCreateNew(true)}
                className="w-1/2 self-end"
              >
                Daftar Pelanggan Baru
              </Button>
            ) : (
              <div className="flex flex-row gap-2 w-full">
                <Button
                  variant="destructive"
                  onClick={() => setIsCreateNew(false)}
                  className="w-1/2"
                >
                  Batal
                </Button>
                <Button onClick={() => onCreateMember()} className="w-1/2">
                  Daftar
                </Button>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label>Deskripsi</Label>
              <Textarea
                value={form.deskripsi || ""}
                onChange={(e) =>
                  setForm({ ...form, deskripsi: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <h4>Rincian Pesanan</h4>
              <Table className="text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-medium">Produk</TableHead>
                    <TableHead className="font-medium">Jumlah</TableHead>
                    <TableHead className="font-medium">Harga</TableHead>
                    <TableHead className="font-medium">Total</TableHead>
                  </TableRow>
                </TableHeader>
                {items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {item?.produk_nama}
                    </TableCell>
                    <TableCell>{item?.jumlah}</TableCell>
                    <TableCell>{formatRupiah(item?.produk_harga)}</TableCell>
                    <TableCell>
                      {formatRupiah(item?.produk_harga * item?.jumlah)}
                    </TableCell>
                  </TableRow>
                ))}
              </Table>
            </div>
            <div className="flex flex-col gap-2">
              <h4>Rincian Pembayaran</h4>
              <Table className="text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-medium">SubTotal</TableHead>
                    <TableCell className="text-right">
                      {formatRupiah(subTotal)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-medium">
                      Diskon ({percentageDisc}%)
                    </TableHead>
                    <TableCell className="text-right">
                      {formatRupiah(discount)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-medium">
                      Pajak ({percentageTax}%)
                    </TableHead>
                    <TableCell className="text-right">
                      {formatRupiah(tax)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-medium">Total</TableHead>
                    <TableCell className="text-right font-medium">
                      {formatRupiah(total)}
                    </TableCell>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit}>Buat Pesanan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

const useKasir = () => {
  const [data, setData] = useState([]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    metode: "Cash",
    kode: null,
    deskripsi: null,
  });
  const [pelanggan, setPelanggan] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [informasi, setInformasi] = useState({
    informasi_id: "",
    persentase_diskon: 0,
    persentase_pajak: 0,
    is_deleted: false,
    created_at: new Date(),
    updated_at: new Date(),
  });

  const [search, setSearch] = useState("");
  const filteredData = data.filter(
    (item) =>
      item.kategori.toLowerCase().includes(search.toLowerCase()) ||
      item.produks.some((p) =>
        p.nama_produk.toLowerCase().includes(search.toLowerCase())
      )
  );

  const fetchPelanggan = async () => {
    try {
      setFetching(true);
      const res = await api.get(`/pelanggan/${form.kode}`);
      setPelanggan(res?.data?.data);
    } catch (error) {
      setPelanggan(null);
      makeToast("error", error);
    } finally {
      setFetching(false);
    }
  };

  const fetchInformasi = async () => {
    try {
      const res = await api.get(`/informasi`);
      setInformasi(res?.data?.data);
    } catch (error) {
      setPelanggan(null);
      makeToast("error", error);
    }
  };

  useDebounce(
    () => {
      if (form.kode && !isCreateNew) {
        fetchPelanggan();
      }
    },
    3000,
    [form.kode]
  );

  const fetchData = async () => {
    try {
      const res = await api.get(`/produk`);
      const uniqueKategori = Array.from(
        new Set(res.data.data.map((item) => item.kategori_produk))
      ).map((kategori) => ({
        kategori,
        produks: res.data.data.filter(
          (item) => item.kategori_produk === kategori
        ),
      }));
      setData(uniqueKategori);
    } catch (error) {
      makeToast("error", error);
    }
  };

  const onAddCart = (item) => {
    const isExist = items.find((i) => i.produk_id === item.produk_id);

    if (item.jumlah_stok < 1) {
      return makeToast("error", "Stok produk tidak mencukupi");
    }
    if (isExist && isExist.jumlah === item.jumlah_stok) {
      return makeToast("error", "Stok produk tidak mencukupi");
    }

    if (isExist) {
      setItems(
        items.map((i) =>
          i.produk_id === item.produk_id ? { ...i, jumlah: i.jumlah + 1 } : i
        )
      );
    } else {
      setItems([
        ...items,
        {
          produk_id: item.produk_id,
          produk_gambar: item.foto_produk,
          produk_harga: item.harga_produk,
          produk_nama: item.nama_produk,
          produk_kategori: item.kategori_produk,
          jumlah: 1,
        },
      ]);
    }
  };

  const onIncrease = (item) => {
    const flattedProduk = data.flatMap((item) => item.produks);
    const isExist = flattedProduk.find((i) => i.produk_id === item.produk_id);

    if (isExist && isExist.jumlah_stok === item.jumlah) {
      return makeToast("error", "Stok produk tidak mencukupi");
    }

    if (isExist) {
      setItems(
        items.map((i) =>
          i.produk_id === item.produk_id ? { ...i, jumlah: i.jumlah + 1 } : i
        )
      );
    }
  };

  const onDecrease = (item) => {
    const isExist = items.find((i) => i.produk_id === item.produk_id);
    if (isExist && isExist.jumlah === 1) {
      setItems(items.filter((i) => i.produk_id !== item.produk_id));
    } else if (isExist) {
      setItems(
        items.map((i) =>
          i.produk_id === item.produk_id ? { ...i, jumlah: i.jumlah - 1 } : i
        )
      );
    }
  };

  useEffect(() => {
    fetchInformasi();
    fetchData();
  }, []);

  const navigate = useNavigate();

  const [pending, setPending] = useState(false);

  const handleSubmit = async () => {
    try {
      console.log("hit1");
      if (items.length === 0) {
        return makeToast("error", "Pesanan tidak boleh kosong");
      }
      console.log("hit2");
      if (pending || fetching) return;
      console.log("hit3");
      setPending(true);
      const request = {
        metode: form.metode,
        deskripsi: form.deskripsi,
        kode: pelanggan && form.kode ? pelanggan.kode_pelanggan : null,
        item_pesanan: items,
      };
      setIsOpen(false);
      const res = await makeConfirm(
        async () => await api.post("/pesanan", request)
      );
      makeToast("success", res?.data?.message);
      if (res?.data?.data?.midtrans_url_redirect) {
        navigate(`/payment/${res?.data.data.pesanan_id}`);
      }
      await fetchData();  
      resetState();
    } catch (error) {
      console.log(error)
      makeToast("error", error);
    } finally {
      setPending(false);
      setFetching(false);
    }
  };

  const resetState = () => {
    setForm(initPesananDTO);
    setItems([]);
  };
const subTotal = items.reduce((acc, item) => acc + item.produk_harga * item.jumlah, 0);


  console.log({subTotal})

  const [isCreateNew, setIsCreateNew] = useState(false);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);

  const onCreateMember = async () => {
    try {
      if (creating) return;
      if (!name || name.length < 3) {
        return makeToast("error", "Nama minimal 3 karakter");
      }
      if (!form.kode) {
        return makeToast("error", "Email / No telepon tidak boleh kosong");
      }
      if (
        !/^(62\d{8,}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(
          form.kode
        )
      ) {
        return makeToast(
          "error",
          "Harus berupa email atau no telepon berawal 62"
        );
      }
      makeToast("info");
      setCreating(true);
      const res = await api.post(`/pelanggan`, {
        kode: form.kode,
        nama: name,
      });
      makeToast("success", res?.data?.message);
      setIsCreateNew(false);
      await fetchPelanggan();
    } catch (error) {
      makeToast("error", error);
    } finally {
      setCreating(false);
    }
  };

  const percentageDisc = pelanggan ? informasi?.persentase_diskon : 0;

  const discount = subTotal * (percentageDisc / 100);

  const priceBeforeTax = subTotal - discount;

  const percentageTax = informasi.persentase_pajak;

  const tax = priceBeforeTax * (percentageTax / 100);

  const total = priceBeforeTax + tax;

  return {
    search,
    setSearch,
    filteredData,
    form,
    setForm,
    onAddCart,
    onDecrease,
    items,
    onIncrease,
    isOpen,
    setIsOpen,
    pelanggan,
    fetching,
    setFetching,
    subTotal,
    percentageDisc,
    discount,
    percentageTax,
    tax,
    total,
    handleSubmit,
    isCreateNew,
    setIsCreateNew,
    name,
    setName,
    onCreateMember,
  };
};

export default KasirPage;
