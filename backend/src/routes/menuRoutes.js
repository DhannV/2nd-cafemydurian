import express from "express";
import {
  getMenu,
  createMenu,
  deleteMenu,
  updateMenu,
} from "../controllers/menuController.js";
import uploadMenu from "../middleware/uploadMenu.js";

const router = express.Router();

router.post("/", uploadMenu.single("image"), createMenu);
router.get("/", getMenu);
router.put("/:id", uploadMenu.single("image"), updateMenu);
router.delete("/:id", deleteMenu);

const baseUrl = process.env.BASE_URL;
const menus = data.map((menu) => ({
  ...menu,
  image: `${baseUrl}/uploads/${menu.image}`,
}));
export default router;
