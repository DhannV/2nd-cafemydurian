import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function ReportYearly() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [year]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE}/api/report/yearly?year=${year}`,
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

  const monthName = (m) =>
    new Date(0, m - 1).toLocaleString("id-ID", { month: "long" });

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Report Tahunan</h1>

      {/* Filter Tahun */}
      <div className="bg-white p-4 rounded shadow mb-6 flex items-center gap-4">
        <label className="font-semibold">Tahun:</label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border p-2 rounded w-32"
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
              <th className="p-3 text-left">Bulan</th>
              <th className="p-3 text-left">Total Order</th>
              <th className="p-3 text-left">Total Pendapatan</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="p-4 text-center">
                  Memuat data...
                </td>
              </tr>
            ) : (
              data?.monthly?.map((item) => (
                <tr key={item.month} className="border-t">
                  <td className="p-3 capitalize">
                    {monthName(item.month)}
                  </td>
                  <td className="p-3">{item.total_order}</td>
                  <td className="p-3">
                    Rp {item.total_income.toLocaleString("id-ID")}
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
