import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

router.get("/google", authController.googleLogin);

router.get(
  "/google/callback",
  authController.googleCallback,
  authController.googleSuccess
);

router.get("/me", (req, res) => {
  if (!req.session || !req.session.admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.json(req.session.admin);
});

router.post("/logout", authController.googleLogout);

export default router;
