import { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../../services/socket";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function DashboardAdmin() {
  const [summary, setSummary] = useState({
    totalOrder: 0,
    totalIncome: 0,
    todayOrder: 0,
    todayIncome: 0,
  });

  const [statusSummary, setStatusSummary] = useState({
    pending: 0,
    settlement: 0,
    expire: 0,
    cancel: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH DASHBOARD DATA
  ========================= */
  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_BASE_URL}/api/report/dashboard`,
        { withCredentials: true }
      );

      setSummary(res.data.summary);
      setChartData(res.data.chart);
      setStatusSummary(res.data.status);
    } catch (err) {
      console.error("Fetch dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     INIT DATA
  ========================= */
  useEffect(() => {
    fetchDashboard();
  }, []);

  /* =========================
     SOCKET REALTIME
  ========================= */
  useEffect(() => {
    socket.on("payment_update", () => {
      fetchDashboard();
    });

    return () => {
      socket.off("payment_update");
    };
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Memuat dashboard...</p>;
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>

      {/* ================= KPI ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <KpiCard title="Total Order" value={summary.totalOrder} />
        <KpiCard
          title="Total Pendapatan"
          value={`Rp ${summary.totalIncome.toLocaleString("id-ID")}`}
        />
        <KpiCard title="Order Hari Ini" value={summary.todayOrder} />
        <KpiCard
          title="Pendapatan Hari Ini"
          value={`Rp ${summary.todayIncome.toLocaleString("id-ID")}`}
        />
      </div>

      {/* ================= GRAFIK ================= */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="font-bold mb-4">
          Grafik Pendapatan 7 Hari Terakhir
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="total"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ================= STATUS ================= */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="font-bold mb-4">Status Transaksi</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatusCard label="Pending" value={statusSummary.pending} />
          <StatusCard label="Settlement" value={statusSummary.settlement} />
          <StatusCard label="Expire" value={statusSummary.expire} />
          <StatusCard label="Cancel" value={statusSummary.cancel} />
        </div>
      </div>
    </>
  );
}

/* =========================
   COMPONENTS
========================= */

function KpiCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

function StatusCard({ label, value }) {
  return (
    <div className="border rounded p-4 text-center">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
