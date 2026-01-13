import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReceiptPopup from "../../../components/ReceiptPopup";

const PaymentOnlineSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const cart = state?.cart || [];
  const note = state?.note || "";
  const method = state?.method;
  const totalPrice = state?.totalPrice;

  const [queueNumber, setQueueNumber] = useState(null);

  const labels = {
    gopay: "GoPay",
    dana: "Dana",
    ovo: "OVO",
    qris: "QRIS",
  };

  // waktu transaksi
  const [timestamp] = useState(() => {
    const now = new Date();
    return now.toLocaleString("id-ID", {
      dateStyle: "long",
      timeStyle: "short",
    });
  });

  // Nomor antrian otomatis
  useEffect(() => {
    let last = localStorage.getItem("queueNumberOnline");
    last = last ? parseInt(last) : 0;

    const next = last + 1;
    localStorage.setItem("queueNumberOnline", next);
    setQueueNumber(next);
  }, []);

  return (
    <div className="min-h-screen bg-amber-50 p-4 pb-20">

      {/* STRUK POPUP */}
      <ReceiptPopup
        cart={cart}
        totalPrice={totalPrice}
        note={note}
        queueNumber={queueNumber}
        method={method} // tampilkan logo sesuai metode pembayaran
        onClose={() => navigate("/")}
      />

      {/* DETAIL PEMBAYARAN */}
      <div className="bg-white p-5 rounded-xl shadow max-w-md mx-auto mt-5">
        <h2 className="text-xl font-bold text-amber-700 text-center">
          Pembayaran Berhasil 🎉
        </h2>

        <p className="text-center text-gray-500 text-sm mt-1">
          Terima kasih sudah melakukan pembayaran
        </p>

        <div className="mt-4 space-y-3">

          <div className="flex justify-between">
            <span className="text-gray-600">Metode Pembayaran</span>
            <span className="font-semibold">{labels[method]}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Total Pembayaran</span>
            <span className="font-semibold">Rp {totalPrice.toLocaleString("id-ID")}</span>
          </div>

          {note && (
            <div>
              <span className="text-gray-600 block mb-1">Catatan</span>
              <div className="p-2 bg-amber-50 rounded-lg border">
                {note}
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-gray-600">Nomor Antrian</span>
            <span className="font-semibold">#{queueNumber}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Waktu Transaksi</span>
            <span className="font-semibold text-right"> {timestamp} </span>
          </div>
        </div>

        {/* QRIS konfirmasi (opsional) */}
        {method === "qris" && (
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=QRIS-PAID"
            className="mx-auto mt-4 w-40 h-40 rounded-lg"
            alt="QRIS"
          />
        )}
      </div>

      {/* KEMBALI */}
      <div className="fixed bottom-5 left-0 right-0 text-center">
        <button
          onClick={() => navigate("/")}
          className="bg-amber-600 text-white px-6 py-3 rounded-full shadow-md active:scale-95"
        >
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
};

export default PaymentOnlineSuccess;
