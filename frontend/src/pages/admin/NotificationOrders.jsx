import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";

export default function NotificationOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/orders/notifications", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setOrders(data));
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Notifikasi Order</h1>

      <div className="bg-white rounded shadow divide-y">
        {orders.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            Tidak ada notifikasi order
          </div>
        ) : (
          orders.map(order => (
            <div
              key={order._id}
              className={`p-4 flex justify-between items-center ${
                !order.isRead ? "bg-orange-50" : ""
              }`}
            >
              <div>
                <p className="font-semibold">
                  Order Baru #{order._id}
                </p>
                <p className="text-sm text-gray-500">
                  {order.customerName} •{" "}
                  {new Date(order.createdAt).toLocaleString("id-ID")}
                </p>
              </div>

              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  order.isRead
                    ? "bg-gray-200 text-gray-600"
                    : "bg-orange-500 text-white"
                }`}
              >
                {order.isRead ? "Dibaca" : "Baru"}
              </span>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
