import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads/menu");
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const uploadMenu = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

export default uploadMenu;
