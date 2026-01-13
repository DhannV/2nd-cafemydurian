import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function ReportMonthly() {
  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7) // YYYY-MM
  );
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [month]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE}/api/report/monthly?month=${month}`,
        { credentials: "include" }
      );
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Report Bulanan</h1>

      {/* Filter */}
      <div className="bg-white p-4 rounded shadow mb-6 flex items-center gap-4">
        <label className="font-semibold">Bulan:</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-500 text-sm">Total Order</p>
          <p className="text-2xl font-bold">
            {data?.total_order ?? 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-500 text-sm">Total Pendapatan</p>
          <p className="text-2xl font-bold">
            Rp {(data?.total_income ?? 0).toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Invoice</th>
              <th className="p-3 text-left">Metode</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Waktu</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="p-4 text-center">
                  Memuat data...
                </td>
              </tr>
            ) : data?.transactions?.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-400">
                  Tidak ada transaksi
                </td>
              </tr>
            ) : (
              data?.transactions?.map((trx) => (
                <tr key={trx.id} className="border-t">
                  <td className="p-3">{trx.invoice}</td>
                  <td className="p-3 uppercase">{trx.payment_method}</td>
                  <td className="p-3">
                    Rp {trx.total_price.toLocaleString("id-ID")}
                  </td>
                  <td className="p-3">
                    {new Date(trx.paid_at).toLocaleString("id-ID")}
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
