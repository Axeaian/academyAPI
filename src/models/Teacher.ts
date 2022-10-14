import { DataTypes } from 'sequelize';
import { db } from "../db/mysql.config";

export const Teacher = db.define('Teacher', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }
});