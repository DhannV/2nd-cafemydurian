import { NavLink } from "react-router-dom";
import { LayoutDashboard, Utensils, History, FileText } from "lucide-react";

const menuClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all
   ${
     isActive
       ? "bg-[#FFCC00] text-white shadow-md"
       : "text-gray-700 hover:bg-orange-100 hover:text-orange-600"
   }`;

export default function SidebarAdmin() {
  return (
    <aside className="w-64 min-h-screen bg-white border-r px-4 py-6">
      {/* Logo / Title */}
      <h2 className="text-2xl font-bold text-[#FFCC00] mb-8">Admin Side</h2>

      {/* Navigation */}
      <nav className="space-y-2">
        <NavLink to="/admin/dashboard" className={menuClass}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/menu" className={menuClass}>
          <Utensils size={20} />
          <span>Management Menu</span>
        </NavLink>

        <NavLink to="/admin/history" className={menuClass}>
          <History size={20} />
          <span>History Transaksi</span>
        </NavLink>

        <NavLink to="/admin/report/daily" className={menuClass}>
          <FileText size={20} />
          <span>Report Harian</span>
        </NavLink>

        <NavLink to="/admin/report/monthly" className={menuClass}>
          <FileText size={20} />
          <span>Report Bulanan</span>
        </NavLink>

        <NavLink to="/admin/report/yearly" className={menuClass}>
          <FileText size={20} />
          <span>Report Tahunan</span>
        </NavLink>
      </nav>
    </aside>
  );
}
