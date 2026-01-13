import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const order = sequelize.define("Order", {
  items: {
    type: DataTypes.JSON,
    allowNull: false
  },
  total: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.STRING,
    defaultValue: "cash"
  },
  paymentStatus: {
    type: DataTypes.STRING,
    defaultValue: "pending"
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "waiting"
  }
});

export default order;
