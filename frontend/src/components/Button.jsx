import React from "react";

const Button = ({ text, color, onClick, icon }) => {
  const colorClasses = {
    yellow: "bg-yellow-400 text-[#ffffff] hover:bg-yellow-500",
    orange: "bg-orange-400 text-white hover:bg-orange-500",
    white: "bg-white text-gray-800 hover:bg-gray-100",
  };

  return (
    <button
      onClick={onClick}
      className={`w-full py-3 rounded-2xl font-semibold shadow-md flex items-center justify-center gap-2 transition-transform duration-150 active:scale-95 ${colorClasses[color]}`}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {text}
    </button>
  );
};

export default Button;
