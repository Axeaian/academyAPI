import { db } from "../db/mysql.config";
import { Student } from "./Student";
import { Teacher } from "./Teacher";

// Connect to Database
db.authenticate()
    .then(() => {
        console.log("DB connection has been established successfully.");
    })
    .catch((error: any) => {
        console.error("Unable to connect to the database: ", error);
    });

Teacher.belongsToMany(Student, { as: "Student", through: 'TeacherToStudent' });
Student.belongsToMany(Teacher, { as: "Teacher", through: 'TeacherToStudent' });

export const sync = () => {
    db.sync();
} 