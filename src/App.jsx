import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RingkasanPage from "./pages/dashboard/RingkasanPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { SidebarProvider } from "./components/ui/sidebar";
import { AuthProvider } from "./context/auth-context";
import { ToastContainer } from "react-toastify";
import ProdukPage from "./pages/master/ProdukPage";
import PemasokPage from "./pages/master/PemasokPage";
import PenggunaPage from "./pages/sistem/PenggunaPage";
import PelangganPage from "./pages/sistem/PelangganPage";
import PembelianProdukPage from "./pages/transaksi/PembelianProdukPage";
import CacatProdukPage from "./pages/transaksi/CacatProdukPage";
import PesananPage from "./pages/transaksi/PesananPage";
import KirimPesanPage from "./pages/dashboard/KirimPesanPage";
import InformasiPembayaranPage from "./pages/dashboard/InformasiPembayaranPage";
import AkunPage from "./pages/pengaturan/AkunPage";
import PrivasiPage from "./pages/pengaturan/PrivasiPage";
import LogoutPage from "./pages/pengaturan/LogoutPage";
import KasirPage from "./pages/transaksi/KasirPage";
import PaymentPage from "./pages/transaksi/PaymentPage";
import AuthPage from "./hoc/AuthPage";
import LaporanPage from "./pages/dashboard/LaporanPage";
import ConfirmResetPasswordPage from "./pages/ConfirmResetPasswordPage";
import InvoicePage from "./pages/transaksi/InvoicePage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <SidebarProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/confirm-reset-password" element={<ConfirmResetPasswordPage />} />

            <Route path="/ringkasan" element={<AuthPage component={RingkasanPage} auth="akses_ringkasan" />} />
            <Route path="/laporan" element={<AuthPage component={LaporanPage} auth="akses_ringkasan" />} />
            <Route path="/kirim-pesan" element={<AuthPage component={KirimPesanPage} auth="akses_kirim_pesan" />} />
            <Route path="/informasi-pembayaran" element={<AuthPage component={InformasiPembayaranPage} auth="akses_informasi" />} />

            <Route path="/pengguna" element={<AuthPage component={PenggunaPage} auth="akses_pengguna" />} />
            <Route path="/pelanggan" element={<AuthPage component={PelangganPage} auth="akses_pelanggan" />} />

            <Route path="/produk" element={<AuthPage component={ProdukPage} auth="akses_produk" />} />
            <Route path="/pemasok" element={<AuthPage component={PemasokPage} auth="akses_pemasok" />} />

            <Route path="/pembelian-produk" element={<AuthPage component={PembelianProdukPage} auth="akses_pembelian" />} />
            <Route path="/cacat-produk" element={<AuthPage component={CacatProdukPage} auth="akses_cacat_produk" />} />
            <Route path="/pesanan" element={<AuthPage component={PesananPage} auth="akses_riwayat_pesanan" />} />
            <Route path="/kasir" element={<AuthPage component={KasirPage} auth="akses_kasir" />} />
            <Route path="/payment/:id" element={<AuthPage component={PaymentPage} auth="all" />} />
            <Route path="/invoice" element={<AuthPage component={InvoicePage} auth="all" />} />

            <Route path="/akun" element={<AuthPage component={AkunPage} auth="all" />} />
            <Route path="/privasi" element={<AuthPage component={PrivasiPage} auth="all" />} />
            <Route path="/logout" element={<AuthPage component={LogoutPage} auth="all" />} />
          </Routes>
        </SidebarProvider>
        <ToastContainer />
      </AuthProvider>
    </Router>
  );
}

export default App;

