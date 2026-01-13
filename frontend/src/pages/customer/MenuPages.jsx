// pages/MenuPages.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CardMenu from "../../components/CardMenu";
import Button from "../../components/Button";

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
    <div className="min-h-screen p-4 bg-gradient-to-b from-amber-50 to-orange-50">
      {/* SEARCH & CART */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Cari menu..."
          className="flex-1 p-3 rounded-xl border border-amber-300 shadow-sm focus:ring-2 focus:ring-amber-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button
          disabled={totalItems === 0}
          onClick={() => navigate("/detail", { state: { cart, note } })}
          className={`relative p-3 rounded-full shadow transition
            ${
              totalItems === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-amber-500 text-white active:scale-95"
            }`}
        >
          🛒
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {/* CATEGORY */}
      <div className="flex gap-2 overflow-x-auto mb-4 pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition
              ${
                activeCategory === cat
                  ? "bg-amber-500 text-white shadow"
                  : "bg-white border border-amber-300 text-amber-700"
              }`}
          >
            {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* MENU GRID */}
      <div className="grid grid-cols-2 gap-3 pb-28">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <CardMenu key={i} loading cart={[]} />
            ))
          : filteredMenus.map((item) => (
              <CardMenu
                key={item.id}
                {...item}
                cart={cart}
                addToCart={addToCart}
                subtractFromCart={subtractFromCart}
              />
            ))}
      </div>

      {/* BACK BUTTON */}
      <Button
        color="orange"
        text="Kembali ke awal"
        onClick={() => setShowConfirm(true)}
      />

      {/* CONFIRM MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-80 p-5 rounded-xl shadow-lg text-center">
            <p className="text-gray-800 mb-4 font-medium">
              Jika kembali ke halaman utama, semua pesanan akan hilang.
              <br />
              Lanjutkan?
            </p>

            <div className="flex justify-center gap-3">
              <button
                className="px-4 py-2 bg-orange-300 rounded-lg font-semibold"
                onClick={() => setShowConfirm(false)}
              >
                Batal
              </button>

              <button
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-semibold"
                onClick={() => navigate("/home")}
              >
                Lanjut
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPages;
