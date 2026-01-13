import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
import dayjs from "dayjs";

class Transaction extends Model {}

Transaction.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    // ORDER ID MIDTRANS (SATU SUMBER KEBENARAN)
    invoice: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    total_price: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    payment_method: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    // STATUS RESMI MIDTRANS
    status_paid: {
      type: DataTypes.ENUM(
        "pending",
        "settlement",
        "expire",
        "cancel",
        "deny",
        "refund",
        "partial_refund"
      ),
      allowNull: false,
      defaultValue: "pending",
    },

    snap_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    paid_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    expired_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    midtrans_response: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "transactions",
    timestamps: true,
    underscored: true,

    defaultScope: {
      attributes: {
        include: [
          [
            sequelize.fn(
              "DATE_FORMAT",
              sequelize.col("created_at"),
              "%Y-%m-%dT%H:%i:%s.000Z"
            ),
            "created_at",
          ],
          [
            sequelize.fn(
              "DATE_FORMAT",
              sequelize.col("updated_at"),
              "%Y-%m-%dT%H:%i:%s.000Z"
            ),
            "updated_at",
          ],
        ],
      },
    },
  }
);

export default Transaction;
