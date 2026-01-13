import React from "react";

const logos = {
  gopay:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/GoPay_logo.svg/512px-GoPay_logo.svg.png",
  dana:
    "https://seeklogo.com/images/D/dana-logo-473B90C876-seeklogo.com.png",
  ovo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Logo_ovo_purple.svg/512px-Logo_ovo_purple.svg.png",
  qris:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/QRIS-Logo.svg/512px-QRIS-Logo.svg.png",
  cod: "https://cdn-icons-png.flaticon.com/512/891/891462.png",
};

const ReceiptPopup = ({
  cart,
  totalPrice,
  note,
  queueNumber,
  method = "cod",
  onClose,
}) => {
  const date = new Date();
  const formattedDate = date.toLocaleString("id-ID", {
    dateStyle: "full",
    timeStyle: "short",
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-[22rem] rounded-xl shadow-lg overflow-hidden animate-fadeIn">
        
        {/* Header */}
        <div className="bg-amber-500 text-white text-center p-4">
          <h2 className="text-xl font-bold">Struk Pembayaran</h2>
          <p className="text-sm opacity-90">Cafe MyDurian</p>
        </div>

        {/* Body */}
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {/* Nomor Antrian */}
          <div className="text-center mb-4">
            <p className="text-gray-600 text-sm">Nomor Antrian</p>
            <p className="text-3xl font-bold text-amber-500">
              {queueNumber || "-"}
            </p>
          </div>

          {/* Detail Pembayaran */}
          <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg mb-4">
            <img
              src={logos[method]}
              alt={method}
              className="w-12 h-12 object-contain"
            />
            <div>
              <p className="font-semibold capitalize">{method}</p>
              <p className="text-xs text-gray-600">{formattedDate}</p>
            </div>
          </div>

          {/* Produk List */}
          <div className="border-t border-b py-3 mb-4">
            {cart.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between py-1 text-sm text-gray-700"
              >
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>Rp {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          {/* Catatan */}
          {note && (
            <div className="bg-amber-50 p-3 rounded-lg mb-4">
              <p className="text-xs text-gray-600">Catatan:</p>
              <p className="text-sm">{note}</p>
            </div>
          )}

          {/* Total */}
          <div className="flex justify-between font-bold text-lg text-amber-500">
            <span>Total</span>
            <span>Rp {totalPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 text-center">
          <button
            onClick={onClose}
            className="bg-amber-500 text-white px-6 py-2 rounded-full w-full active:scale-95"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPopup;
