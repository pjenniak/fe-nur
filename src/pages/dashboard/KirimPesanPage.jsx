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
import { Textarea } from "@/components/ui/textarea";
import { APP_NAME } from "@/constant";
import { makeConfirm } from "@/helper/makeConfirm";

const KirimPesanPage = () => {
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
    onClickTemplate,
  } = useKirimPesans();
  const TABLE_HEADERS = [
    "No",
    "Subjek",
    "Pengirim",
    "Total Penerima",
    "Tanggal Kirim",
    "",
  ];
  return (
    <DashboardLayout
      title="Kirim Pesan"
      childredHeader={
        <Button variant="default" onClick={onClickAdd}>
          <Plus />
          Pesan Baru
        </Button>
      }
    >
      <div className="relative w-full md:w-fit min-w-[300px]">
        <Input
          className="w-full"
          placeholder="Cari riwayat kirim pesan..."
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
              <TableRow key={item.pesan_terkirim_id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium">{item.subjek_pesan}</TableCell>
                <TableCell>{item.user?.nama_pengguna}</TableCell>
                <TableCell>{item.pelanggan_count}</TableCell>
                <TableCell>{formatDate(item.created_at, true, true)}</TableCell>
                <TableCell>
                  <Button
                    variant="secondary"
                    onClick={() => onClickItem(item, true)}
                  >
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableCaption>
            Pesan akan dikirimkan ke email / whatsapp semua pelanggan terdaftar
          </TableCaption>
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
              <DialogTitle>{form.id ? "Detail" : "Kirim Pesan"}</DialogTitle>
              <DialogDescription>
                {form.id
                  ? "Detail riwayat kirim pesan"
                  : "Isi form dibawah ini untuk mengirim pesan"}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Subjek</Label>
                <Input
                  placeholder="Pemberitahuan Diskon"
                  value={form.subjek}
                  onChange={(e) => onChange(e, "subjek")}
                  disabled={!!form.id}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Pesan</Label>
                <Textarea
                  value={form.pesan}
                  onChange={(e) => onChange(e, "pesan")}
                  disabled={!!form.id}
                />
              </div>
              {!form.id && !form.subjek && (
                <div className="flex flex-col gap-2">
                  <Label>Template Pesan</Label>
                  {TEMPLATES.map((item, index) => (
                    <Button
                      key={index}
                      variant="secondary"
                      onClick={() => onClickTemplate(item)}
                      type="button"
                    >
                      {item.judul}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            <DialogFooter>
              {!form.id && <Button type="submit">Kirim</Button>}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

const initKirimPesanDTO = {
  id: "",
  subjek: "",
  pesan: "",
};

const useKirimPesans = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(initKirimPesanDTO);
  const [isOpen, setIsOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const onClickItem = (item, isEdit) => {
    setForm({
      id: item.pesan_terkirim_id,
      subjek: item.subjek_pesan,
      pesan: item.isi_pesan,
    });
    if (isEdit) setIsOpen(true);
  };

  const onClickAdd = () => {
    setForm(initKirimPesanDTO);
    setIsOpen(true);
  };

  const onChange = (
    e,
    key
  ) => {
    setForm({
      ...form,
      [key]: e.target.value,
    });
  };

  const filteredData = data.filter(
    (item) =>
      item.subjek_pesan.toLowerCase().includes(search.toLowerCase()) ||
      item.user?.nama_pengguna.toLowerCase().includes(search.toLowerCase())
  );

  const fetchData = async () => {
    try {
      const res = await api.get("/pesan");
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
      });
      if (pending) return;
      setPending(true);
      setIsOpen(false)
      await makeConfirm(async () => await api.post("/pesan", form));      
      await fetchData();
      makeToast("success", "Berhasil menambahkan pesan");
      setIsOpen(false);
      setForm(initKirimPesanDTO);
    } catch (error) {
      makeToast("error", error);
    } finally {
      setPending(false);
    }
  };

  const onClickTemplate = (item) => {
    setForm({
      id: "",
      subjek: item.subjek,
      pesan: item.pesan,
    });
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
    onClickTemplate,
  };
};

const TEMPLATES = [
  {
    judul: "Diskon",
    subjek: `Pemberitahuan Diskon ${APP_NAME}`,
    pesan: `Halo Pelanggan Setia ${APP_NAME},\n\nKami ingin memberitahukan Anda bahwa sebagai anggota, Anda berhak mendapatkan diskon spesial pada pembelian berikutnya. Segera kunjungi kami untuk menikmati potongan harga menarik yang hanya tersedia untuk Anda!\n\nTerima kasih telah menjadi bagian dari ${APP_NAME}. Nikmati belanja Anda!`,
  },
  {
    judul: "Promo",
    subjek: `Promo Spesial dari ${APP_NAME}`,
    pesan: `Hai Pelanggan ${APP_NAME},\n\nKami punya promo menarik untuk Anda! Dapatkan penawaran spesial yang hanya berlaku untuk pelanggan terdaftar kami. Jangan lewatkan kesempatan untuk mendapatkan harga terbaik hanya di ${APP_NAME}.\n\nKunjungi kami sekarang dan nikmati penawaran terbaik kami!`,
  },
  {
    judul: "Pemberitahuan Pembaruan",
    subjek: `Pembaruan Terbaru dari ${APP_NAME}`,
    pesan: `Halo Pelanggan ${APP_NAME},\n\nKami ingin memberi tahu Anda bahwa ada beberapa pembaruan penting yang akan meningkatkan pengalaman belanja Anda di ${APP_NAME}. Kami terus berinovasi untuk memberikan layanan yang lebih baik. Pastikan Anda tidak ketinggalan pembaruan terbaru dari kami!\n\nTerima kasih atas dukungan Anda yang terus menerus!`,
  },
  {
    judul: "Ucapan Terima Kasih",
    subjek: `Terima Kasih dari ${APP_NAME}`,
    pesan: `Hai Pelanggan ${APP_NAME},\n\nTerima kasih telah menjadi pelanggan setia kami. Kami menghargai setiap kunjungan dan transaksi yang Anda lakukan di ${APP_NAME}. Sebagai bentuk apresiasi, kami ingin menawarkan penawaran spesial untuk Anda pada pembelian berikutnya!\n\nTerima kasih telah memilih ${APP_NAME} sebagai tempat belanja Anda!`,
  },
  {
    judul: "Notifikasi Keanggotaan",
    subjek: `Keanggotaan Anda di ${APP_NAME}`,
    pesan: `Halo Pelanggan ${APP_NAME},\n\nKami ingin mengingatkan Anda bahwa Anda adalah anggota yang sangat berharga di ${APP_NAME}. Nikmati semua keuntungan dan diskon eksklusif yang hanya tersedia untuk anggota kami. Pastikan untuk memanfaatkan semua benefit yang Anda dapatkan!\n\nTerima kasih atas kepercayaan Anda pada ${APP_NAME}.`,
  },
];

export default KirimPesanPage;
