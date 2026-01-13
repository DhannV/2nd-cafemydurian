import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaUtensils, FaShoppingBag } from "react-icons/fa";
import Button from "../../components/Button";
import LoadingScreen from "../components/LoadingScreen";
import Footer from "../components/Footer";

const Home = () => {
  const navigate = useNavigate();

  const handleNavigateMenu = (type) => {
    navigate("/menu", { state: { orderType: type } });
  };

  return (
    <>
      {showLoading && <LoadingScreen />}

      {/* ---------- MAIN PAGE ---------- */}
      <div className="min-h-screen flex flex-col items-center justify-center text-[#FCF9F7] p-6 ">
        <img
          className="pb-10"
          src="public/logo-yellow.png"
          alt="logo my durian"
        />
        <h1 className="text-3xl font-extrabold text-[#FFCC00] mb-6 text-center">
          Selamat Datang di{" "}
          <span className="text-[#FFCC00]">Cafe MyDurian</span>
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
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Home;
