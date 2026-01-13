// pages/MenuPages.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CardMenu from "../../components/CardMenu";
import Button from "../../components/Button";
import Footer from "../../components/Footer";

const CATEGORIES = ["all", "durian", "kopi", "gula"];

const MenuPages = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // STATE
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [note, setNote] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  /**
   * RESTORE CART STATE
   */
  useEffect(() => {
    if (location.state?.cart) setCart(location.state.cart);
    if (location.state?.note) setNote(location.state.note);
  }, [location.state]);

  /**
   * FETCH MENU
   */
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(
          "https://twond-cafemydurian.onrender.com/api/menu"
        );
        const data = await res.json();
        setMenus(data.data || data);
      } catch (err) {
        console.error("Gagal mengambil data menu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  /**
   * CART HANDLER
   */
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const subtractFromCart = (id) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  /**
   * FILTER MENU
   */
  const filteredMenus = useMemo(() => {
    return menus.filter(
      (menu) =>
        (activeCategory === "all" || menu.category === activeCategory) &&
        menu.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [menus, activeCategory, searchTerm]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="p-4 min-h-screen bg-gradient-to-b bg-[#FCF9F7]">
      {/* Search + Cart */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Cari menu..."
          className="flex-1 p-3 rounded-xl border border-amber-300 shadow-sm focus:ring-2 focus:ring-amber-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button
          className="relative ml-2 p-3 bg-[#FFCC00] text-white rounded-full shadow active:scale-95"
          // Saat pindah ke detail, kita bawa orderId juga
          onClick={() =>
            navigate("/detail", { state: { cart, note, orderId } })
          }
        >
          🛒
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto mb-4 pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeCategory === cat
                ? "bg-[#FFCC00] text-white shadow"
                : "bg-white border border-amber-300 text-[#757575]"
            }`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3 mb-6">
        {loading
          ? Array(10)
              .fill(0)
              .map((_, i) => <CardMenu key={i} loading cart={[]} />)
          : filteredMenus.map((item) => (
              <CardMenu
                key={item.id}
                {...item}
                // Pastikan CardMenu menggunakan props ini dengan benar
                addToCart={() => handleAddToCart(item)}
                subtractFromCart={() => handleSubtractFromCart(item.id)}
                cart={cart}
              />
            ))}
      </div>

      {/* Button Back */}
      <Button
        color="yellow"
        text="Kembali ke awal"
        onClick={() => setShowConfirm(true)}
      />

      {/* Popup */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#FCF9F7] w-80 p-5 rounded-xl shadow-lg text-center">
            <p className="text-gray-800 mb-4 font-medium">
              Jika anda kembali ke halaman utama, semua pesanan akan hilang.
              <br /> Ingin lanjut?
            </p>

            <div className="flex gap-3 justify-center">
              <button
                className="px-4 py-2 bg-orange-400 rounded-lg text-gray-800 font-semibold active:scale-95"
                onClick={() => setShowConfirm(false)}
              >
                Batal
              </button>

              <button
                className="px-4 py-2 bg-yellow-500 rounded-lg text-white font-semibold active:scale-95"
                onClick={() => navigate("/")}
              >
                Lanjut
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default MenuPages;
