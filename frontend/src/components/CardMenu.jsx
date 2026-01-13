// components/CardMenu.jsx
import React from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

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
    <div className="relative bg-white rounded-xl shadow hover:shadow-md transition p-3 flex flex-col">
      {/* Product Image */}
      <img
        src={`https://twond-cafemydurian.onrender.com${image}`}
        alt={name}
        className="w-full h-28 object-cover rounded-lg"
      />

      {/* Name */}
      <h3 className="mt-2 font-semibold text-gray-800 text-sm">{name}</h3>

      {/* Price */}
      <p className="text-amber-600 font-bold text-sm">Rp{price}</p>

      {/* Add Button / Qty Control */}
      <div className="mt-auto pt-2">
        {qty === 0 ? (
          <button
            onClick={() => addToCart({ id, name, price, image })}
            className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-semibold active:scale-95 transition"
          >
            Tambah
          </button>
        ) : (
          <div className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-lg py-2 px-3">
            <button
              onClick={() => subtractFromCart(id)}
              className="p-2 bg-white rounded-full shadow active:scale-95 border border-amber-300"
            >
              <FaMinus size={10} />
            </button>

            <span className="font-semibold text-gray-800">{qty}</span>

            <button
              onClick={() => addToCart({ id, name, price, image })}
              className="p-2 bg-amber-500 text-white rounded-full shadow active:scale-95"
            >
              <FaPlus size={10} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardMenu;
