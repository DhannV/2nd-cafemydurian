import crypto from "crypto";

const order_id = "INV-1768178407372";
const status_code = "200";
const gross_amount = "30000.00";
const serverKey = "SB-Mid-server-XXXX";

const signature = crypto
  .createHash("sha512")
  .update(order_id + status_code + gross_amount + serverKey)
  .digest("hex");

console.log(signature);
