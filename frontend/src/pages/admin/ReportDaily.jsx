import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ReportDaily() {
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [report, setReport] = useState([]);
  const [summary, setSummary] = useState({
    total_order: 0,
    total_income: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReport();
  }, [date]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        `${API_BASE_URL}/api/report/daily?date=${date}`,
        { credentials: "include" }
      );

      setReport(res.data.data || []);
      setSummary({
        total_order: res.data.total_order || 0,
        total_income: res.data.total_income || 0,
      });
    } catch (err) {
      console.error(err);
      setError("Gagal memuat report harian");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Report Harian</h1>

      {/* FILTER */}
      <div className="bg-white p-4 rounded shadow mb-6 flex items-center gap-4">
        <label className="font-semibold">Tanggal:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-500 text-sm">Total Order</p>
          <p className="text-2xl font-bold">{summary.total_order}</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-500 text-sm">Total Pendapatan</p>
          <p className="text-2xl font-bold">
            Rp {summary.total_income.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Invoice</th>
              <th className="p-3 text-left">Metode</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Waktu</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  Memuat data...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-red-500">
                  {error}
                </td>
              </tr>
            ) : report.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-400">
                  Tidak ada transaksi
                </td>
              </tr>
            ) : (
              report.map((trx) => (
                <tr key={trx.invoice} className="border-t">
                  <td className="p-3 font-mono text-blue-600">
                    {trx.invoice}
                  </td>
                  <td className="p-3 uppercase">
                    {trx.payment_method}
                  </td>
                  <td className="p-3">
                    Rp {trx.total_price.toLocaleString("id-ID")}
                  </td>
                  <td className="p-3">
                    {trx.status_paid}
                  </td>
                  <td className="p-3 text-gray-500">
                    {trx.paid_at
                      ? new Date(trx.paid_at).toLocaleTimeString("id-ID")
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
