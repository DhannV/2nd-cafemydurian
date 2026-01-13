import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import SidebarAdmin from "./SidebarAdmin";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/me", {
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then(() => setLoading(false))
      .catch(() => navigate("/admin/login"));
  }, []);

  if (loading) {
    return <div className="p-10">Loading Admin...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarAdmin />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
