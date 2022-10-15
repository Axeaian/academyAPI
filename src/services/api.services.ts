import { Response } from "express";
import { QueryTypes } from "sequelize";
import { db } from "../db/mysql.config";
import { Student } from "../models/Student";
import { Teacher } from "../models/Teacher";

export default class ApiService {
    constructor() {
    }
    private readonly GET_STUDENTS_QUERY = `select s.email as email from TeacherToStudent ts join Teachers t on t.id = ts.teacherid join Students s on s.id = ts.studentid where t.email in (:teachers)`;

    async registerStudents(teacherEmail: string, studentsEmail: string[], res: Response): Promise<Response> {
        try {
            const [teacher, created] = await Teacher.findOrCreate({ where: { email: teacherEmail } });

            studentsEmail.forEach(async (email) => {
                const [student, created] = await Student.findOrCreate({ where: { email: email } });
                await student.addTeacher(teacher);
            })
            return res.status(204).send();
        }
        catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Server Error" });
        }
    }

    async getCommonStudents(teachers: string[], res: Response): Promise<Response> {
        try {
            //remove empty emails from array
            let teachersArr: string[] = teachers.filter(e => e);
            let query: string = this.GET_STUDENTS_QUERY + ((teachersArr.length === 1) ? `;` : ` group by s.email having count(*) > 1;`);
            const results = await db.query(query, {
                replacements: { teachers: teachersArr },
                type: QueryTypes.SELECT
            });

            let studentsEmail: string[] = [];
            if (results.length !== 0) {
                results.forEach((student: { email: string }) => studentsEmail.push(student.email))
            }
            return res.status(200).send({ students: studentsEmail });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: "Server Error" });
        }
    }

    async suspendStudent(studentEmail: string, res: Response): Promise<Response> {
        try {
            let student = await Student.findOne({ where: { email: studentEmail } });
            if (student === null) {
                return res.status(400).send({ message: "Invalid Student" });
            }
            if (student.isSuspended) {
                return res.status(200).send({ message: "Student is already suspended" });
            }
            await Student.update({ isSuspended: true }, {
                where: {
                    email: studentEmail
                }
            });
            return res.status(204).send();
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: "Server Error" });
        }
    }

    async getNotificationUsers(teacherEmail: string, notification: string, res: Response): Promise<Response> {
        //Check if teacher is valid
        let teacher = await Teacher.findOne({ where: { email: teacherEmail } });
        if (teacher === null) {
            return res.status(403).send({ message: "Invalid Teacher" });
        }

        //Get @mentioned users
        const mentionedString = notification.substring(notification.indexOf('@') + 1);
        const mentionedEmails = mentionedString.split(" @");
        let studentsEmail: Array<string> = [];
        if (mentionedEmails !== null) {
            studentsEmail = [...mentionedEmails];
        }

        //Get students related to teacher
        let results = await db.query(this.GET_STUDENTS_QUERY + `;`, {
            replacements: { teachers: teacherEmail },
            type: QueryTypes.SELECT
        });
        if (results.length !== 0) {
            results.forEach((student: { email: string; }) => studentsEmail.push(student.email))
        }
        console.log(studentsEmail);
        const uniqueStudents = [...new Set(studentsEmail)];

        //Check if students retrieved is suspended
        const notSuspendedStudentsQuery = `Select email from Students where email in (:studentsEmail) and isSuspended = false`;
        results = await db.query(notSuspendedStudentsQuery + `;`, {
            replacements: { studentsEmail: uniqueStudents },
            type: QueryTypes.SELECT
        });
        let notificationUsers: string[] = [];
        if (results.length !== 0) {
            results.forEach((student: { email: string; }) => notificationUsers.push(student.email))
        }

        return res.status(200).send({ recipients: notificationUsers });
    }
}