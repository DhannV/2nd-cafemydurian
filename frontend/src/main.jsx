import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePages from "./pages/customer/HomePages.jsx";
import MenuPages from "./pages/customer/MenuPages.jsx";
import DetailPages from "./pages/customer/DetailPages.jsx";
import PaymentOnlineSucces from "./pages/customer/payment/PaymentOnlineSucces.jsx";

import LoginAdmin from "./pages/admin/LoginAdmin.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import DashboardAdmin from "./pages/admin/DashboardAdmin.jsx";
import MenuManagement from "./pages/admin/MenuManagement.jsx";
import TransactionHistory from "./pages/admin/TransactionHistory.jsx";
import ReportDaily from "./pages/admin/ReportDaily.jsx";
import ReportMonthly from "./pages/admin/ReportMonthly.jsx";
import ReportYearly from "./pages/admin/ReportYearly.jsx";
import NotificationOrders from "./pages/admin/NotificationOrders.jsx";

import LoadingScreen from "./components/LoadingScreen.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePages />} />
        <Route path="/home" element={<HomePages />} />
        <Route path="/menu" element={<MenuPages />} />
        <Route path="/detail" element={<DetailPages />} />
        <Route
          path="/payment-online-succes"
          element={<PaymentOnlineSucces />}
        />

        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardAdmin />} />
          <Route path="dashboard" element={<DashboardAdmin />} />
          <Route path="menu" element={<MenuManagement />} />
          <Route path="history" element={<TransactionHistory />} />
          <Route path="report/daily" element={<ReportDaily />} />
          <Route path="report/monthly" element={<ReportMonthly />} />
          <Route path="report/yearly" element={<ReportYearly />} />
          <Route path="notification" element={<NotificationOrders />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
