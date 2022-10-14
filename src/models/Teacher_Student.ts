import { db } from "../db/mysql.config";
import { Teacher } from './Teacher';
import { Student } from './Student';
import { DataTypes } from "sequelize";

export const TeacherToStudent = db.define('TeacherToStudent', {
    TeacherId: {
        type: DataTypes.BIGINT,
        references: {
            model: Teacher,
            key: 'id'
        }
    },
    StudentId: {
        type: DataTypes.BIGINT,
        references: {
            model: Student,
            key: 'id'
        }
    },
});