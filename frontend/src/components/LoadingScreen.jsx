import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [bgTransition, setBgTransition] = useState(false);

  useEffect(() => {
    // Mulai transisi background
    setTimeout(() => {
      setBgTransition(true);
    }, 1000);

    // Hilang setelah 4 detik
    setTimeout(() => {
      setIsLoading(false);
    }, 4000);
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-[9999] transition-colors duration-1000 ease-in-out ${
        bgTransition ? "bg-[#FFCC00]" : "bg-white"
      }`}
    >
      <div
        className={`relative transition-transform duration-700 ease-out ${
          bgTransition ? "scale-100" : "scale-0"
        }`}
      >
        {/* Desktop */}
        <div className="hidden md:block">
          <div className="relative w-64 h-64">
            <div className="absolute inset-0 bg-[#FFCC00] rounded-full"></div>
            <div className="absolute inset-4">
              <img
                src="frontend/public/logo-yellow.png"
                alt="Cafe MyDurian Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="block md:hidden">
          <div className="relative w-40 h-40">
            <div className="absolute inset-0 bg-[#FFCC00] rounded-full"></div>
            <div className="absolute inset-4">
              <img
                src="frontend/public/logo-yellow.png"
                alt="Cafe MyDurian Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
