import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";


// Base use API di frontend 
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchTransactions(controller.signal);
    return () => controller.abort();
  }, []);

  const fetchTransactions = async (signal) => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        `${API_BASE_URL}/api/admin/history`,
        { signal }
      );

      setTransactions(res.data?.data || []);
    } catch (err) {
      if (err.name !== "CanceledError") {
        console.error("Gagal mengambil transaksi:", err);
        setError("Gagal memuat data transaksi");
      }
    } finally {
      setLoading(false);
    }
  };

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-700",
    settlement: "bg-green-100 text-green-700",
    paid: "bg-green-100 text-green-700",
    expire: "bg-red-100 text-red-700",
    expired: "bg-red-100 text-red-700",
    cancel: "bg-gray-200 text-gray-600",
    canceled: "bg-gray-200 text-gray-600",
    failed: "bg-red-100 text-red-700",
  };

  const formatDate = (date) =>
    date ? dayjs(date).format("DD MMM YYYY, HH:mm") : "-";

  const formatRupiah = (value) =>
    new Intl.NumberFormat("id-ID").format(value || 0);

  // Menentukan waktu transaksi 
  const getTransactionTime = (trx) => {
    if (!trx) return null;

    switch (trx.status_paid) {
      case "settlement":
      case "paid":
        return trx.paid_at || trx.updated_at;

      case "expire":
      case "expired":
        return trx.expired_at || trx.updated_at;

      case "cancel":
      case "canceled":
        return trx.updated_at;

      default:
        return trx.created_at;
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">History Transaksi</h1>

      <div className="bg-white p-4 rounded shadow overflow-x-auto">
        {loading ? (
          <p>Memuat transaksi...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : transactions.length === 0 ? (
          <p className="text-gray-500">Belum ada transaksi</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-sm">
                <th className="text-left py-2">Invoice</th>
                <th className="text-left py-2">Total</th>
                <th className="text-left py-2">Metode</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Waktu</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((trx) => (
                <tr key={trx.id} className="border-b text-sm">
                  <td
                    className="py-2 font-mono text-blue-600 cursor-pointer hover:underline"
                    onClick={() => setSelectedTransaction(trx)}
                  >
                    {trx.invoice}
                  </td>

                  <td className="py-2">
                    Rp {formatRupiah(trx.total_price)}
                  </td>

                  <td className="py-2 uppercase">
                    {trx.payment_method}
                  </td>

                  <td className="py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        statusColor[trx.status_paid] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {trx.status_paid}
                    </span>
                  </td>

                  <td className="py-2 text-gray-500">
                    {formatDate(getTransactionTime(trx))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedTransaction && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
              onClick={() => setSelectedTransaction(null)}
            />

            <motion.div
              className="relative bg-white rounded-2xl shadow-xl w-11/12 max-w-md p-6 z-10"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h2 className="text-lg font-bold text-blue-600">
                  Detail Transaksi
                </h2>
                <button
                  className="text-gray-400 hover:text-gray-600 text-xl"
                  onClick={() => setSelectedTransaction(null)}
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                <span className="font-semibold text-gray-600">Invoice</span>
                <span>{selectedTransaction.invoice}</span>

                

                <span className="font-semibold text-gray-600">Total</span>
                <span>
                  Rp {formatRupiah(selectedTransaction.total_price)}
                </span>

                <span className="font-semibold text-gray-600">Metode</span>
                <span className="uppercase">
                  {selectedTransaction.payment_method}
                </span>

                <span className="font-semibold text-gray-600">Status</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold w-fit ${
                    statusColor[selectedTransaction.status_paid]
                  }`}
                >
                  {selectedTransaction.status_paid}
                </span>

                <span className="font-semibold text-gray-600">Waktu</span>
                <span>
                  {formatDate(getTransactionTime(selectedTransaction))}
                </span>

                <span className="font-semibold text-gray-600">Pesan</span>
                <span className="break-words">
                  {selectedTransaction.message || "-"}
                </span>
              </div>

              <div className="mt-6 text-right">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  onClick={() => setSelectedTransaction(null)}
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
