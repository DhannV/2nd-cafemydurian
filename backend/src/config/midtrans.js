import midtransClient from "midtrans-client";

export const snap = new midtransClient.snap({
  isProduction: false, // sandbox
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});
