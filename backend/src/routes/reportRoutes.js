import express from "express";
import {
  dailyReport,
  monthlyReport,
  yearlyReport,
  dashboardReport
} from "../controllers/reportController.js";

const router = express.Router();

router.get("/daily", dailyReport);
router.get("/monthly", monthlyReport);
router.get("/yearly", yearlyReport);
router.get("/dashboard", dashboardReport);

export default router;
