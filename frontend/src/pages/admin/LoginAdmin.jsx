import { LogIn } from "lucide-react";
import footer from "../../components/customer/Footer.jsx";

export default function LoginAdmin() {
  const handleLogin = () => {
    window.location.href =
      "https://twond-cafemydurian.onrender.com/api/auth/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br bg-white">
      <div className="bg-orange-400 w-full max-w-md p-8 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="text-center mb-8 bg-[#FFCC00]">
          <div className="mx-auto w-14 h-14 flex items-center justify-center bg-[#FFCC00] text-white rounded-full mb-4">
            <LogIn size={28} />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-white text-sm mt-1">Masuk ke dashboard admin</p>
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium py-3 rounded-lg transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Login dengan Google
        </button>

        {/* Footer */}
        <p className="text-xs text-white text-center mt-6">
          Hanya admin terdaftar yang dapat mengakses sistem
        </p>
      </div>
      <Footer />
    </div>
  );
}
