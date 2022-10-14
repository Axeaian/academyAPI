const { Sequelize } = require('sequelize');
import dotenv from "dotenv";

dotenv.config();
export const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT || 3306,
    pool: {
      max: 10 || process.env.DB_CONNECTION_LIMIT,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });