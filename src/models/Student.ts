import { DataTypes } from 'sequelize';
import { db } from "../db/mysql.config";

export const Student = db.define('Student', {
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
    },
    isSuspended: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});