import dotenv from "dotenv";
dotenv.config();

export function authMiddleware(req, res, next) {
  if (req.session && req.session.admin) {
    return next();
  }

  return res.status(401).json({
    message: "Unauthorized: Admin not logged in",
  });
}

export function adminOnly(req, res, next) {
  if (!req.session || !req.session.admin) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const role = req.session.admin.role;

  if (role !== "admin") {
    return res.status(403).json({
      message: "Forbidden: Access denied",
    });
  }

  next();
}
