import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "http";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import morgan from "morgan";
import path from "path";

import sequelize from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import menuRoutes from "./src/routes/menuRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import reportRoutes from "./src/routes/reportRoutes.js";
import adminRoutes from "./src/routes/transactionRoutes.js";

import { initSocket } from "./src/utils/socket.js";
import "./src/services/googleAuth.js";

/* ================== APP ================== */

const app = express();
const httpServer = createServer(app);

/* ================== TRUST PROXY ================== */
// WAJIB untuk cookie secure di production
app.set("trust proxy", 1);

/* ================== SOCKET INIT ================== */

const io = initSocket(httpServer);

// ⬅️ HARUS PALING AWAL
app.use((req, res, next) => {
  req.io = io;
  next();
});

/* ================== MIDDLEWARE ================== */

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

/* ================== SESSION ================== */

app.use(
  session({
    name: "cafemydurian-session",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 hari
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

/* ================== DATABASE ================== */

try {
  await sequelize.authenticate();
  console.log("DB connected");

  if (process.env.NODE_ENV !== "production") {
    await sequelize.sync();
    console.log("DB synced (dev only)");
  }
} catch (err) {
  console.error("DB connection failed:", err);
  sequelize
    .authenticate()
    .then(() => console.log("DB connected"))
    .catch((err) => console.error("DB error:", err.message));
}

/* ================== STATIC FILES ================== */

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* ================== ROUTES ================== */

app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API CafeMyDurian Running 🚀" });
});

/* ================== GLOBAL ERROR HANDLER ================== */

app.use((err, req, res, next) => {
  console.error("Global Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

/* ================== SERVER ================== */

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
