import crypto from "crypto";
import midtransClient from "midtrans-client";
import Transaction from "../models/transaction.js";
import dayjs from "dayjs";
import { clearCache } from "../utils/reportCache.js";
import { emitPaymentUpdate } from "../utils/socket.js";

/* =========================
   MIDTRANS CONFIG
========================= */
const snap = new midtransClient.Snap({
  isProduction: false, // ⛔ ubah ke true saat live
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

/* =========================
   CREATE PAYMENT
========================= */
export const createPayment = async (req, res) => {
  try {
    const { amount, message, payment_method = "bca_va" } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const invoice = `INV-${Date.now()}`;

    const startTime = dayjs();
    const expiryTime = startTime.add(1, "minute");

    const expiry = {
      start_time: startTime.format("YYYY-MM-DD HH:mm:ss ZZ"),
      unit: "minute",
      duration: 1,
    };

    // SIMPAN TRANSAKSI
    const transaction = await Transaction.create({
      invoice,
      total_price: amount,
      payment_method,
      status_paid: "pending",
      expired_at: expiryTime.toDate(),
      message: message || null,
    });

    // MIDTRANS PARAM
    const parameter = {
      transaction_details: {
        order_id: invoice,
        gross_amount: amount,
      },
      enabled_payments: [payment_method],
      expiry,
    };

    const snapResponse = await snap.createTransaction(parameter);

    await transaction.update({
      snap_token: snapResponse.token,
      midtrans_response: snapResponse,
    });

    return res.json({
      invoice,
      redirect_url: snapResponse.redirect_url,
      expired_at: expiryTime.toISOString(),
    });
  } catch (err) {
    console.error("CreatePayment Error:", err);
    return res.status(500).json({ message: err.message });
  }
};

/* =========================
   MIDTRANS WEBHOOK (FINAL)
========================= */
export const midtransWebhook = async (req, res) => {
  try {
    console.log("🔥 WEBHOOK MASUK:", req.body);

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      settlement_time,
    } = req.body;

    /* =========================
       SIGNATURE VALIDATION (WAJIB)
    ========================= */
    const rawSignature =
      order_id +
      status_code +
      gross_amount +
      process.env.MIDTRANS_SERVER_KEY;

    const expectedSignature = crypto
      .createHash("sha512")
      .update(rawSignature)
      .digest("hex");

    if (signature_key !== expectedSignature) {
      console.error("❌ INVALID SIGNATURE");
      return res.status(403).json({ message: "Invalid signature" });
    }

    /* =========================
       CARI TRANSAKSI
    ========================= */
    const transaction = await Transaction.findOne({
      where: { invoice: order_id },
    });

    if (!transaction) {
      console.error("❌ TRANSACTION NOT FOUND:", order_id);
      return res.status(404).json({ message: "Transaction not found" });
    }

    /* =========================
       IDEMPOTENCY CHECK
       (anti webhook dobel)
    ========================= */
    if (transaction.status_paid === "settlement") {
      return res.json({ success: true });
    }

    /* =========================
       STATUS MAPPING
    ========================= */
    let statusPaid = transaction_status;
    let paidAt = transaction.paid_at;
    let expiredAt = transaction.expired_at;

    if (transaction_status === "settlement") {
      statusPaid = "settlement";
      paidAt = settlement_time
        ? dayjs(settlement_time).toDate()
        : new Date();
    }

    if (transaction_status === "expire") {
      statusPaid = "expired";
      expiredAt = new Date();
    }

    if (["deny", "cancel", "refund"].includes(transaction_status)) {
      statusPaid = "failed";
    }

    /* =========================
       UPDATE DATABASE
    ========================= */
    await transaction.update({
      status_paid: statusPaid,
      paid_at: paidAt,
      expired_at: expiredAt,
      midtrans_response: req.body,
    });

    console.log("✅ STATUS UPDATED:", statusPaid);

    /* =========================
       CLEAR REPORT CACHE
    ========================= */
    clearCache("report:");

    /* =========================
       REALTIME SOCKET
    ========================= */
    emitPaymentUpdate({
      invoice: transaction.invoice,
      status: statusPaid,
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("🔥 WEBHOOK ERROR DETAIL:", err);
    return res.status(500).json({ message: "Webhook error" });
  }
};
