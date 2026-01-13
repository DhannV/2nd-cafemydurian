import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdQrCode } from "react-icons/md";
import axios from "axios";
import Button from "src/components/Button";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DetailPages = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const cart = location.state?.cart || [];
  const [note, setNote] = useState(location.state?.note || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ===============================
     HITUNG TOTAL (OPTIMIZED)
  ================================ */
  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  /* ===============================
     HANDLE QRIS PAYMENT
  ================================ */
  const handlePayQris = async () => {
    if (loading) return;

    if (!cart.length) {
      setError("Keranjang masih kosong");
      return;
    }

    if (totalPrice <= 0) {
      setError("Total pembayaran tidak valid");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        `${API_BASE_URL}/api/payment/create`,
        {
          amount: totalPrice,
          message: note || null,
        },
        {
          timeout: 15000,
        }
      );

      const redirectUrl = res.data?.redirect_url;

      if (!redirectUrl) {
        throw new Error("Redirect URL tidak tersedia");
      }

      // ⏩ REDIRECT KE MIDTRANS
      window.location.replace(redirectUrl);
    } catch (err) {
      console.error("QRIS Payment Error:", err);

      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || "Gagal menghubungi server pembayaran"
        );
      } else {
        setError("Terjadi kesalahan saat memproses pembayaran");
      }

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 p-4 flex flex-col">
      {/* TITLE */}
      <h1 className="text-2xl font-bold text-center text-[#FFCC00] mb-6">
        Detail Pesanan
      </h1>

      {/* CART EMPTY */}
      {cart.length === 0 ? (
        <p className="text-center text-[#FFCC00] text-base">
          Keranjang masih kosong
        </p>
      ) : (
        <>
          {/* LIST PRODUK */}
          <div className="mb-5 space-y-3 overflow-auto">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-2xl shadow-sm border border-amber-200 flex justify-between items-center"
              >
                <div>
                  <h2 className="text-gray-900 font-semibold">{item.name}</h2>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>

                <p className="font-semibold text-gray-900">
                  Rp
                  {(item.price * item.quantity).toLocaleString("id-ID")}
                </p>
              </div>
            ))}
          </div>

          {/* NOTE & TOTAL */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-amber-200 mb-6">
            <div className="flex justify-between mb-3">
              <span className="font-medium text-gray-700">Total</span>
              <span className="font-bold text-amber-600">
                Rp{totalPrice.toLocaleString("id-ID")}
              </span>
            </div>

            <textarea
              className="w-full p-3 rounded-xl border border-amber-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              placeholder="Tambahkan catatan pesanan (opsional)"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* ERROR */}
          {error && (
            <p className="text-sm text-red-600 text-center mb-3">{error}</p>
          )}

          {/* ACTION BUTTON */}
          <Button
            color="yellow"
            text={loading ? "Memproses..." : "Bayar dengan QRIS"}
            icon={<MdQrCode size={20} />}
            disabled={loading}
            onClick={handlePayQris}
          />

          {/* BACK */}
          <button
            onClick={() => navigate("/menu", { state: { cart, note } })}
            className="mt-4 text-sm text-amber-700 hover:underline self-center"
            disabled={loading}
          >
            ← Kembali ke Menu
          </button>
        </>
      )}
    </div>
  );
};

export default DetailPages;
