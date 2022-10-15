import ApiService from '../src/services/api.services';
import { Teacher } from '../src/models/Teacher';
import { Student } from '../src/models/Student';
import { Response } from 'express';
import { db } from '../src/db/mysql.config';

const teacherEmail = "test@testacademy.com";
const teachersEmail = ["1@testacademy.com", "2@testacademy.com"];
const studentsEmail = ["student1@testacademy.com", "student2@testacademy.com"];
let res = ({ status: jest.fn().mockReturnThis(), send: jest.fn(), err: jest.fn() } as unknown) as Response;

beforeEach(() => {
    jest.clearAllMocks();
})

const apiService = new ApiService();
describe('registerStudents service', () => {
    let student = { addTeacher: jest.fn() }
    Teacher.findOrCreate = jest.fn().mockReturnValue([]);
    Student.findOrCreate = jest.fn().mockReturnValue([student]);

    it('should return 204 with valid request', async () => {
        await apiService.registerStudents(teacherEmail, studentsEmail, res);
        expect(Teacher.findOrCreate).toHaveBeenCalledTimes(1);
        expect(Student.findOrCreate).toHaveBeenCalledTimes(2);
        expect(res.status).toBeCalledWith(204);
    })
})

describe('getCommonStudents service', () => {
    jest.mock('../src/db/mysql.config');
    let students = [
        { email: "student1@testacademy.com" },
        { email: "student2@testacademy.com" }
    ]
    jest.mocked(db).query = jest.fn().mockReturnValue(students)

    it('should return 200 with valid request', async () => {
        await apiService.getCommonStudents(teachersEmail, res);
        expect(db.query).toHaveBeenCalledTimes(1);
        expect(res.status).toBeCalledWith(200);
        expect(res.send).toBeCalledWith({ students: studentsEmail });
    })
})

describe('suspendStudent service', () => {
    let studentEmail = "student@testacademy.com";

    it('should return 204 when valid student is found', async () => {
        Student.findOne = jest.fn().mockReturnValueOnce({ isSuspended: false });

        await apiService.suspendStudent(studentEmail, res);
        expect(Student.findOne).toHaveBeenCalledTimes(1);
        expect(res.status).toBeCalledWith(204);
    })

    it('should return 400 when no student is found', async () => {
        Student.findOne = jest.fn().mockReturnValueOnce(null);

        await apiService.suspendStudent(studentEmail, res);
        expect(Student.findOne).toHaveBeenCalledTimes(1);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith({ message: "Invalid Student" });
    })

    it('should return 200 when student was already suspended', async () => {
        Student.findOne = jest.fn().mockReturnValueOnce({ isSuspended: true });

        await apiService.suspendStudent(studentEmail, res);
        expect(Student.findOne).toHaveBeenCalledTimes(1);
        expect(res.status).toBeCalledWith(200);
        expect(res.send).toBeCalledWith({ message: "Student is already suspended" });
    })
})

describe('getNotificationUsers service', () => {
    jest.mock('../src/db/mysql.config');
    let notification = "hello";
    let students = [
        { email: "student1@testacademy.com" },
        { email: "student2@testacademy.com" }
    ]
    Teacher.findOne = jest.fn().mockReturnValue([]);
    jest.mocked(db).query = jest.fn().mockReturnValue(students)


    it('should return 204 with valid request', async () => {
        await apiService.getNotificationUsers(teacherEmail, notification, res);
        expect(Teacher.findOne).toHaveBeenCalledTimes(1);
        expect(db.query).toHaveBeenCalledTimes(2);
        expect(res.status).toBeCalledWith(200);
        expect(res.send).toBeCalledWith({ recipients: studentsEmail });
    })

    it('should return 403 when teacher is not found', async () => {
        Teacher.findOne = jest.fn().mockReturnValue(null);
        await apiService.getNotificationUsers(teacherEmail, notification, res);
        expect(Teacher.findOne).toHaveBeenCalledTimes(1);
        expect(res.status).toBeCalledWith(403);
        expect(res.send).toBeCalledWith({ message: "Invalid Teacher" });
    })
})