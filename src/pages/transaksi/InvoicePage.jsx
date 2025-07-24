import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/ui/layout/dashboard-layout";
import { api } from "@/config/api";
import { makeToast } from "@/helper/makeToast";
import formatDate from "@/helper/formatDate";
import formatRupiah from "@/helper/formatRupiah";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/constant/index";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock } from "lucide-react";

const InvoicePage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate()

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!orderId) return;

      try {
        const res = await api.get(`/pesanan/${orderId}`);
        setInvoice(res.data.data);
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [orderId]);

  if (loading) {
    return null;
  }

  if (!invoice) {
    nav("/kasir")
  }

  // Status dan ikon
  const status = invoice.status_pembayaran;
  const statusIcon =
    status === "Success" ? (
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
    ) : status === "Pending" ? (
      <Clock className="w-16 h-16 text-yellow-500 mx-auto" />
    ) : (
      <XCircle className="w-16 h-16 text-red-500 mx-auto" />
    );

  const statusColor =
    status === "Success"
      ? "text-green-600"
      : status === "Pending"
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="w-full min-h-screen flex items-center justify-center p-8">
        <Card className="w-full max-w-2xl shadow-md border">
          <CardHeader className="text-center">
            {statusIcon}
            <CardTitle className={`mt-2 text-2xl font-bold ${statusColor}`}>
              Pembayaran {status}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 p-6">
            {/* Informasi Pesanan */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Informasi Pesanan</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p>
                    <strong>Tanggal:</strong>{" "}
                    {formatDate(invoice.created_at, true, true)}
                  </p>
                  <p>
                    <strong>Status:</strong> {invoice.status_pembayaran}
                  </p>
                  <p>
                    <strong>Metode Pembayaran:</strong>{" "}
                    {invoice.metode_pembayaran}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Pelanggan:</strong>{" "}
                    {invoice?.pelanggan?.nama_pelanggan || "Non Member"}
                  </p>
                  <p>
                    <strong>Kode Pelanggan:</strong>{" "}
                    {invoice?.pelanggan?.kode_pelanggan || "-"}
                  </p>
                  <p>
                    <strong>Total Pembayaran:</strong>{" "}
                    {formatRupiah(invoice.total_akhir)}
                  </p>
                </div>
              </div>
            </section>

            {/* Tombol Aksi */}
            <div className="flex flex-wrap gap-3 pt-4 border-t mt-4">
              {status === "Pending" && (
                <Link to={`/payment/${invoice.pesanan_id}`}>
                  <Button variant="secondary">Bayar Sekarang</Button>
                </Link>
              )}

              <div className="flex flex-row gap-2 items-center">
                {status === "Success" && (
                  <Link
                    to={`${API_URL}/resource/pesanan/${invoice.pesanan_id}/nota`}
                    target="_blank"
                  >
                    <Button>Cetak Nota</Button>
                  </Link>
                )}
                <Link to={`/kasir`}>
                  <Button>Kembali ke Kasir</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvoicePage;
