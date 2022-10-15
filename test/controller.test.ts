import { getCommonStudents, getNotificationUsers, registerStudents, suspendStudent } from '../src/controllers/api.controller';
import type { Request, Response } from 'express';
import ApiService from '../src/services/api.services';

const mockRegisterStudents = jest.fn();
const mockGetCommonStudents = jest.fn();
const mockSuspendStudent = jest.fn();
const mockGetNotificationUsers = jest.fn();
jest.mock('../src/services/api.services', () => {
    return jest.fn().mockImplementation(() => {
        return {
            registerStudents: () => mockRegisterStudents(),
            getCommonStudents: () => mockGetCommonStudents(),
            suspendStudent: () => mockSuspendStudent(),
            getNotificationUsers: () => mockGetNotificationUsers()

        };
    });
});

describe('registerStudents controller', () => {
    it('should call mockRegisterStudents with valid request', async () => {
        let body = {
            "teacher": "teacher1@testacademy.com",
            "students": ["test@testacademy.com"]
        }
        let header: any[] = []
        const mReq = ({ rawHeaders: header, body: body } as unknown) as Request;
        const mRes = {} as Response;
        await registerStudents(mReq, mRes);
        expect(ApiService).toHaveBeenCalledTimes(1);
        expect(mockRegisterStudents).toHaveBeenCalledTimes(1);
    });

    it('should return 400 with no teacher param in request', async () => {
        let body = {
            "students": ["test@testacademy.com"]
        }
        let header: any[] = []
        const mReq = ({ rawHeaders: header, body: body } as unknown) as Request;
        const mRes = ({ status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown) as Response;
        await registerStudents(mReq, mRes);
        expect(mRes.status).toBeCalledWith(400);
        expect(mRes.send).toBeCalledWith({ message: "Invalid request received" });
    });

    it('should return 400 with no students param in request', async () => {
        let body = {
            "teacher": "test@testacademy.com"
        }
        let header: any[] = []
        const mReq = ({ rawHeaders: header, body: body } as unknown) as Request;
        const mRes = ({ status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown) as Response;
        await registerStudents(mReq, mRes);
        expect(mRes.status).toBeCalledWith(400);
        expect(mRes.send).toBeCalledWith({ message: "Invalid request received" });
    });

    it('should return 400 with empty students array in request', async () => {
        let body = {
            "teacher": "teacher1@testacademy.com",
            "students": []
        }
        let header: any[] = []
        const mReq = ({ rawHeaders: header, body: body } as unknown) as Request;
        const mRes = ({ status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown) as Response;
        await registerStudents(mReq, mRes);
        expect(mRes.status).toBeCalledWith(400);
        expect(mRes.send).toBeCalledWith({ message: "Invalid request received" });
    });
})

describe('getCommonStudents controller', () => {
    it('should call mockGetCommonStudents with valid teacher request', async () => {
        let url = "/api/commonstudents?teacher=teacher1@testacademy.com&teacher=teacher2@testacademy.com'"
        let header: any[] = []
        const mReq = ({ rawHeaders: header, originalUrl: url } as unknown) as Request;
        const mRes = {} as Response;
        await getCommonStudents(mReq, mRes);
        expect(ApiService).toHaveBeenCalledTimes(1);
        expect(mockGetCommonStudents).toHaveBeenCalledTimes(1);
    });

    it('should return 400 with missing teacher in request', async () => {
        let url = "/api/commonstudents?principal=teacher1@testacademy.com'"
        let header: any[] = []
        const mReq = ({ rawHeaders: header, originalUrl: url } as unknown) as Request;
        const mRes = ({ status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown) as Response;
        await getCommonStudents(mReq, mRes);
        expect(mRes.status).toBeCalledWith(400);
        expect(mRes.send).toBeCalledWith({ message: "Invalid request received" });
    });

    it('should return 400 with empty teacher in request', async () => {
        let url = "/api/commonstudents?teacher="
        let header: any[] = []
        const mReq = ({ rawHeaders: header, originalUrl: url } as unknown) as Request;
        const mRes = ({ status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown) as Response;
        await getCommonStudents(mReq, mRes);
        expect(mRes.status).toBeCalledWith(400);
        expect(mRes.send).toBeCalledWith({ message: "Invalid request received" });
    });
})

describe('suspendStudent controller', () => {
    it('should call mockSuspendStudent with valid request', async () => {
        let body = {
            "student": "test@testacademy.com"
        }
        let header: any[] = []
        const mReq = ({ rawHeaders: header, body: body } as unknown) as Request;
        const mRes = {} as Response;
        await suspendStudent(mReq, mRes);
        expect(ApiService).toHaveBeenCalledTimes(1);
        expect(mockSuspendStudent).toHaveBeenCalledTimes(1);
    });

    it('should return 400 with empty student in request', async () => {
        let body = {
            "student": []
        }
        let header: any[] = []
        const mReq = ({ rawHeaders: header, body: body } as unknown) as Request;
        const mRes = ({ status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown) as Response;
        await suspendStudent(mReq, mRes);
        expect(mRes.status).toBeCalledWith(400);
        expect(mRes.send).toBeCalledWith({ message: "Invalid request received" });
    });

    it('should return 400 with student Array in request', async () => {
        let body = {
            "student": ["test@testacademy.com"]
        }
        let header: any[] = []
        const mReq = ({ rawHeaders: header, body: body } as unknown) as Request;
        const mRes = ({ status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown) as Response;
        await suspendStudent(mReq, mRes);
        expect(mRes.status).toBeCalledWith(400);
        expect(mRes.send).toBeCalledWith({ message: "Invalid request received" });
    });
})

describe('getNotificationUsers controller', () => {
    let teacher = "teacher1@testacademy.com"
    it('should call mockGetNotificationUsers with valid request', async () => {
        let body = {
            "teacher": teacher,
            "notification": "Hello!"
        }
        let header: any[] = []
        const mReq = ({ rawHeaders: header, body: body } as unknown) as Request;
        const mRes = {} as Response;
        await getNotificationUsers(mReq, mRes);
        expect(ApiService).toHaveBeenCalledTimes(1);
        expect(mockGetNotificationUsers).toHaveBeenCalledTimes(1);
    });

    it('should return 400 with missing teacher in request', async () => {
        let body = {
            "teacher": teacher
        }
        let header: any[] = []
        const mReq = ({ rawHeaders: header, body: body } as unknown) as Request;
        const mRes = ({ status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown) as Response;
        await getNotificationUsers(mReq, mRes);
        expect(mRes.status).toBeCalledWith(400);
        expect(mRes.send).toBeCalledWith({ message: "Invalid request received" });
    });

    it('should return 400 with missing notification in request', async () => {
        let body = {
            "notification": "Hello!"
        }
        let header: any[] = []
        const mReq = ({ rawHeaders: header, body: body } as unknown) as Request;
        const mRes = ({ status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown) as Response;
        await getNotificationUsers(mReq, mRes);
        expect(mRes.status).toBeCalledWith(400);
        expect(mRes.send).toBeCalledWith({ message: "Invalid request received" });
    });
})