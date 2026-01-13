import { Op, fn, col, literal } from "sequelize";
import dayjs from "dayjs";
import Transaction from "../models/transaction.js";
import { getCache, setCache } from "../utils/reportCache.js";

/* =========================
   DASHBOARD REPORT
   GET /api/report/dashboard
========================= */
export const dashboardReport = async (req, res) => {
  try {
    const cacheKey = "report:dashboard";
    const cached = getCache(cacheKey);
    if (cached) return res.json(cached);

    const todayStart = dayjs().startOf("day").toDate();
    const todayEnd = dayjs().endOf("day").toDate();

    /* =========================
       SUMMARY
    ========================= */
    const totalOrder = await Transaction.count({
      where: { status_paid: "settlement" },
    });

    const totalIncome =
      (await Transaction.sum("total_price", {
        where: { status_paid: "settlement" },
      })) || 0;

    const todayOrder = await Transaction.count({
      where: {
        status_paid: "settlement",
        paid_at: { [Op.between]: [todayStart, todayEnd] },
      },
    });

    const todayIncome =
      (await Transaction.sum("total_price", {
        where: {
          status_paid: "settlement",
          paid_at: { [Op.between]: [todayStart, todayEnd] },
        },
      })) || 0;

    /* =========================
       STATUS SUMMARY
    ========================= */
    const statusRows = await Transaction.findAll({
      attributes: ["status_paid", [fn("COUNT", col("id")), "total"]],
      group: ["status_paid"],
      raw: true,
    });

    const status = {
      pending: 0,
      settlement: 0,
      expire: 0,
      cancel: 0,
    };

    statusRows.forEach((row) => {
      status[row.status_paid] = Number(row.total);
    });

    /* =========================
       CHART (7 HARI TERAKHIR)
    ========================= */
    const chartRows = await Transaction.findAll({
      attributes: [
        [fn("DATE", col("paid_at")), "date"],
        [fn("SUM", col("total_price")), "total"],
      ],
      where: {
        status_paid: "settlement",
        paid_at: {
          [Op.gte]: dayjs().subtract(6, "day").startOf("day").toDate(),
        },
      },
      group: [fn("DATE", col("paid_at"))],
      order: [[literal("date"), "ASC"]],
      raw: true,
    });

    // Lengkapi tanggal kosong
    const chart = Array.from({ length: 7 }, (_, i) => {
      const date = dayjs().subtract(6 - i, "day").format("YYYY-MM-DD");
      const found = chartRows.find((r) => r.date === date);

      return {
        date,
        total: found ? Number(found.total) : 0,
      };
    });

    const response = {
      summary: {
        totalOrder,
        totalIncome,
        todayOrder,
        todayIncome,
      },
      status,
      chart,
    };

    setCache(cacheKey, response, 60);
    return res.json(response);
  } catch (err) {
    console.error("Dashboard Report Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const dailyReport = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const cacheKey = `report:daily:${date}`;

    // 🔥 1. CEK CACHE
    const cached = getCache(cacheKey);
    if (cached) {
      console.log("⚡ DAILY REPORT FROM CACHE");
      return res.json(cached);
    }

    // 2. RANGE HARI
    const start = dayjs(date).startOf("day").toDate();
    const end = dayjs(date).endOf("day").toDate();

    // 3. QUERY DB
    const transactions = await Transaction.findAll({
      where: {
        status_paid: "settlement",
        paid_at: {
          [Op.between]: [start, end],
        },
      },
      order: [["paid_at", "ASC"]],
    });

    const total_order = transactions.length;
    const total_income = transactions.reduce(
      (sum, t) => sum + t.total_price,
      0
    );

    const response = {
      data: transactions,
      total_order,
      total_income,
    };

    // 🔥 4. SIMPAN CACHE (60 detik)
    setCache(cacheKey, response, 60);

    return res.json(response);
  } catch (err) {
    console.error("Report Daily Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   REPORT BULANAN
   /api/report/monthly?month=2026-01
========================= */
export const monthlyReport = async (req, res) => {
  try {
    const { month } = req.query;
    if (!month) {
      return res.status(400).json({ message: "Month is required (YYYY-MM)" });
    }

    const cacheKey = `report:monthly:${month}`;
    const cached = getCache(cacheKey);
    if (cached) return res.json(cached);

    const startDate = dayjs(month).startOf("month").toDate();
    const endDate = dayjs(month).endOf("month").toDate();

    const transactions = await Transaction.findAll({
      where: {
        status_paid: "settlement",
        paid_at: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [["paid_at", "DESC"]],
    });

    const totalOrder = transactions.length;
    const totalIncome = transactions.reduce(
      (sum, t) => sum + t.total_price,
      0
    );

    const response = {
      period: month,
      total_order: totalOrder,
      total_income: totalIncome,
      transactions,
    };

    setCache(cacheKey, response, 60);
    return res.json(response);
  } catch (err) {
    console.error("Report Monthly Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   REPORT TAHUNAN
   /api/report/yearly?year=2026
========================= */
export const yearlyReport = async (req, res) => {
  try {
    const { year } = req.query;
    if (!year) {
      return res.status(400).json({ message: "Year is required" });
    }

    const cacheKey = `report:yearly:${year}`;
    const cached = getCache(cacheKey);
    if (cached) return res.json(cached);

    const startDate = dayjs(`${year}-01-01`).startOf("year").toDate();
    const endDate = dayjs(`${year}-12-31`).endOf("year").toDate();

    const rows = await Transaction.findAll({
      attributes: [
        [fn("MONTH", col("paid_at")), "month"],
        [fn("COUNT", col("id")), "total_order"],
        [fn("SUM", col("total_price")), "total_income"],
      ],
      where: {
        status_paid: "settlement",
        paid_at: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: [fn("MONTH", col("paid_at"))],
      order: [[fn("MONTH", col("paid_at")), "ASC"]],
      raw: true,
    });

    const monthly = Array.from({ length: 12 }, (_, i) => {
      const found = rows.find((r) => Number(r.month) === i + 1);
      return {
        month: i + 1,
        total_order: found ? Number(found.total_order) : 0,
        total_income: found ? Number(found.total_income) : 0,
      };
    });

    const totalOrder = monthly.reduce((s, m) => s + m.total_order, 0);
    const totalIncome = monthly.reduce((s, m) => s + m.total_income, 0);

    const response = {
      year,
      total_order: totalOrder,
      total_income: totalIncome,
      monthly,
    };

    setCache(cacheKey, response, 60);
    return res.json(response);
  } catch (err) {
    console.error("Report Yearly Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
