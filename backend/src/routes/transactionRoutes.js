import express from "express";
import { Op } from "sequelize";
import dayjs from "dayjs";
import Transaction from "../models/transaction.js";

const router = express.Router();

router.get("/history", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      from,
      to,
    } = req.query;

    const offset = (page - 1) * limit;

    // Where Condition
    const where = {};

    if (status) {
      where.status_paid = status;
    }

    if (from || to) {
      where.created_at = {};
      if (from) {
        where.created_at[Op.gte] = dayjs(from).startOf("day").toDate();
      }
      if (to) {
        where.created_at[Op.lte] = dayjs(to).endOf("day").toDate();
      }
    }

    // Query DB
    const { rows, count } = await Transaction.findAndCountAll({
      where,
      order: [["created_at", "DESC"]],
      limit: Number(limit),
      offset: Number(offset),
      attributes: [
        "id",
        "invoice",
        "total_price",
        "payment_method",
        "status_paid",
        "message",
        "created_at",
        "expired_at",
      ],
    });

    // Format Response
    const data = rows.map((trx) => ({
      id: trx.id,
      invoice: trx.invoice,
      total_price: trx.total_price,
      payment_method: trx.payment_method,
      status_paid: trx.status_paid,
      message: trx.message,
      created_at: trx.created_at
        ? dayjs(trx.created_at).toISOString()
        : null,
      expired_at: trx.expired_at
        ? dayjs(trx.expired_at).toISOString()
        : null,
    }));

    res.json({
      meta: {
        page: Number(page),
        limit: Number(limit),
        total: count,
      },
      data,
    });
  } catch (err) {
    console.error("Admin History Error:", err);
    res.status(500).json({
      message: "Gagal mengambil history transaksi",
    });
  }
});

export default router;
