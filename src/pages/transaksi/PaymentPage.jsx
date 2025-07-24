import { Button } from "@/components/ui/button";
import { api } from "@/config/api";
import { MIDTRANS_CLIENT_KEY } from "@/constant";
import { makeToast } from "@/helper/makeToast";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const PaymentPage = () => {
  const { loading, isFinished } = usePayment();

  if (loading) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center min-h-screen">
      {isFinished && (
        <Link to={"/pesanan"}>
          <Button>Kembali Ke Pesanan</Button>
        </Link>
      )}
    </div>
  );
};

const usePayment = () => {
  const navigate = useNavigate();
  const id = useParams().id || "";
  const [loading, setLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  const fetchPayment = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/pesanan/${id}`);
      setLoading(false);
      const { midtrans_url_redirect } = res.data.data;
      const snapToken = midtrans_url_redirect?.split("/").pop() || "";
      console.log({ snapToken });
      window?.snap?.pay(snapToken, {
        onSuccess: async () => {
          navigate("/pesanan");
          console.log("SUCCESS");   
          makeToast("info", "Memverifikasi pembayaran");
          await api.get(`/pesanan/${id}`);
          makeToast("info", "Pembayaran selesai di verifikasi");
          setIsFinished(true);
        },
        onPending: (result) => {
          console.log("PENDING", result);
        },
        onError: (result) => {
          console.log("ERROR", result);
          setIsFinished(true);
        },
        onClose: async () => {
          navigate("/pesanan");
          await api.get(`/pesanan/${id}`);
          console.log("CLOSE");
          setIsFinished(true);
        },
      });
    } catch (error) {
      console.log(error);
      makeToast("error", error);
    }
  };

  useEffect(() => {
    const snapSrcUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const script = document.createElement("script");
    script.src = snapSrcUrl;
    script.setAttribute("data-client-key", MIDTRANS_CLIENT_KEY);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  });

  useEffect(() => {
    fetchPayment();
  }, []);

  return { loading, isFinished };
};

export default PaymentPage;
