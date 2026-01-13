import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Menu = sequelize.define(
  "menu",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM("durian", "kopi", "gula"),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "menus", 
    timestamps: true,
  }
);

export default Menu;
