import express from "express";
import {
  createPayment,
  midtransWebhook,
} from "../controllers/paymentController.js";

const router = express.Router();

// create payment (dipanggil frontend)
router.post("/create", createPayment);

// webhook dari Midtrans
router.post("/webhook", midtransWebhook);

export default router;
