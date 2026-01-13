// components/CardMenu.jsx
import React from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
const BASE_URL = "https://twond-cafemydurian.onrender.com";

const CardMenu = ({
  id,
  name,
  price,
  image,
  addToCart,
  subtractFromCart,
  cart,
  loading,
}) => {
  const itemInCart = cart?.find((item) => item.id === id);
  const qty = itemInCart ? itemInCart.quantity : 0;

  if (loading) {
    return (
      <div className="w-full bg-white rounded-xl p-4 shadow animate-pulse">
        <div className="w-full h-24 bg-gray-200 rounded-xl mb-3"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-md transition p-3 mx-auto w-full">
      <div className="w-full rounded-lg overflow-hidden">
        <img
          src={`${BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`}
          alt={name}
          onError={(e) => {
            e.target.src = "/placeholder.png";
          }}
          className="w-full aspect-[4/3] object-cover"
        />
      </div>

      {/* Product Image */}

      {/* Name */}
      <h3 className="mt-2 font-semibold text-gray-800 text-xs">{name}</h3>

      {/* Price */}
      <p className="text-amber-600 font-bold text-xs">Rp{price}</p>

      {/* Add Button / Qty Control */}
      <div className="mt-auto pt-2">
        {qty === 0 ? (
          <button
            onClick={() => addToCart({ id, name, price, image })}
            className="w-full py-1.5 bg-[#FFCC00] hover:bg-[#ebb207] text-white rounded-lg text-xs font-semibold active:scale-95 transition"
          >
            Tambah
          </button>
        ) : (
          <div className="flex items-center justify-between bg-orange-50 border border-[#FFCC00] rounded-lg py-1.5 px-2">
            <button
              onClick={() => subtractFromCart(id)}
              className="p-1.5 bg-white rounded-full shadow active:scale-95 border border-amber-300"
            >
              <FaMinus size={9} />
            </button>

            <span className="font-semibold text-gray-800 text-sm">{qty}</span>

            <button
              onClick={() => addToCart({ id, name, price, image })}
              className="p-1.5 bg-[#FFCC00] text-white rounded-full shadow active:scale-95"
            >
              <FaPlus size={9} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardMenu;
