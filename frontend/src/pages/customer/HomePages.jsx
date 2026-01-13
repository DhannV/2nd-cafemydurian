import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaUtensils, FaShoppingBag } from "react-icons/fa";
import Button from "../../components/Button";
import Footer from "../../components/Footer";
import LoadingScreen from "../../components/LoadingScreen";

const Home = () => {
  const navigate = useNavigate();
  const [showLoading, setShowLoading] = useState(false);

  const handleNavigateMenu = (type) => {
    setShowLoading(true); // munculkan loading
    setTimeout(() => {
      navigate("/menu", { state: { orderType: type } });
    }, 4000);
  };

  const handleNavigateAdmin = (type) => {
    setShowLoading(true); // munculkan loading
    setTimeout(() => {
      navigate("/admin", { state: { orderType: type } });
    }, 4000);
  };

  return (
    <>
      {showLoading && <LoadingScreen />}

      {/* ---------- MAIN PAGE ---------- */}
      <div className="min-h-screen flex flex-col items-center justify-center text-[#FCF9F7] p-6 ">
        <img
          className="pb-10"
          src="frontend/public/logo-yellow.png"
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
            color="yellow"
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
        <Footer />
      </div>
    </>
  );
};

export default Home;
