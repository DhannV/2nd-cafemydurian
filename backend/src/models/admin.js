import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const admin = sequelize.define("Admin", {
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  googleId: DataTypes.STRING,
  role: { type: DataTypes.STRING, defaultValue: "kasir" }
});

export default admin;
