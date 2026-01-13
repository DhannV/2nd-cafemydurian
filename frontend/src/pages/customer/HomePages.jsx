import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaUtensils, FaShoppingBag } from "react-icons/fa";
import Button from "../../components/Button";

const Home = () => {
  const navigate = useNavigate();

  const handleNavigateMenu = (type) => {
    navigate("/menu", { state: { orderType: type } });
  };
  const handleNavigateAdmin = (type) => {
    navigate("/admin", { state: { orderType: type } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-100 p-6">
      <h1 className="text-3xl font-extrabold text-yellow-800 mb-6 text-center">
        Selamat Datang di <span className="text-yellow-600">Cafe MyDurian</span>
      </h1>

      <p className="text-gray-700 text-center mb-8 max-w-md">
        Silakan pilih jenis pesanan kamu di bawah ini
      </p>

      <div className="flex flex-col w-full max-w-sm gap-4">
        <Button
          color="orange"
          text="Dine-In"
          icon={<FaUtensils />}
          onClick={() => handleNavigateMenu("dine-in")}
        />
        <Button
          color="yellow"
          text="Bungkus"
          icon={<FaShoppingBag />}
          onClick={() => handleNavigateMenu("takeaway")}
        />
        <Button
          color="white"
          text="login admin"
          onClick={() => handleNavigateAdmin("admin")}
        />
      </div>
    </div>
  );
};

export default Home;
