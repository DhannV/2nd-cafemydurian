import fs from "fs";
import path from "path";
import Menu from "../models/Menu.js";

const getImagePath = (image) =>
  path.join(process.cwd(), "uploads", "menu", path.basename(image));

export const createMenu = async (req, res) => {
  try {
    const { name, price, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Gambar wajib diisi" });
    }

    const menu = await Menu.create({
      name,
      price,
      category,
      image: `/uploads/menu/${req.file.filename}`,
    });

    res.status(201).json({
      message: "Menu berhasil ditambahkan",
      data: menu,
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal menambahkan menu" });
  }
};

export const getMenu = async (req, res) => {
  try {
    const menus = await Menu.findAll();
    res.json({ data: menus });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil menu" });
  }
};

export const updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category } = req.body;

    const menu = await Menu.findByPk(id);
    if (!menu) {
      return res.status(404).json({ message: "Menu tidak ditemukan" });
    }

    if (req.file && menu.image) {
      const oldPath = getImagePath(menu.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

      menu.image = `/uploads/menu/${req.file.filename}`;
    }

    menu.name = name;
    menu.price = price;
    menu.category = category;

    await menu.save();

    res.json({
      message: "Menu berhasil diperbarui",
      data: menu,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal memperbarui menu" });
  }
};

export const deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;

    const menu = await Menu.findByPk(id);
    if (!menu) {
      return res.status(404).json({ message: "Menu tidak ditemukan" });
    }

    if (menu.image) {
      const imagePath = getImagePath(menu.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await menu.destroy();

    res.json({ message: "Menu berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus menu" });
  }
};
