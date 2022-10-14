import superTestRequest from 'supertest';
import { app } from '../src/app';

describe('POST /api/register', () => {
    // test('should return 204 with correct request', async () => {
    //     let request = {
    //         "teacher": "teacher1@testacademy.com",
    //         "students": [
    //             "janet@testacademy.com",
    //             "bryan@testacademy.com",
    //         ]
    //     }
    //     await superTestRequest(app)
    //         .post('/api/register')
    //         .set('Content-Type', 'application/json')
    //         .send(request)
    //         .expect(204);
    // });

    test('should return invalid with malformed request (missing param)', function () {
        let request = {
            "teacher": "teacher3@testacademy.com"
        }
        return superTestRequest(app)
            .post('/api/register')
            .set('Content-Type', 'application/json')
            .send(request)
            .expect(400)
            .then(response => {
                expect(response.body.message).toBe("Invalid request received");
            })
    });

    test('should return invalid with malformed request (for teacher)', function () {
        let request = {
            "teacher": "",
            "students": ["AAA@testacademy.com", "DDD@testacademy.com"]
        }
        return superTestRequest(app)
            .post('/api/register')
            .set('Content-Type', 'application/json')
            .send(request)
            .expect(400)
            .then(response => {
                expect(response.body.message).toBe("Invalid request received");
            })
    });

    test('should return invalid with malformed request (for students)', function () {
        let request = {
            "teacher": "teacher3@testacademy.com",
            "students": []
        }
        return superTestRequest(app)
            .post('/api/register')
            .set('Content-Type', 'application/json')
            .send(request)
            .expect(400)
            .then(response => {
                expect(response.body.message).toBe("Invalid request received");
            })
    });
})

describe('GET /api/commonstudents', () => {
    let commonStudents = {
        "students": [
            'janet@testacademy.com',
            'bryan@testacademy.com'
        ]
    };
    test('should return all students for 1 teacher', async () => {
        await superTestRequest(app)
            .get('/api/commonstudents?teacher=teacher1@testacademy.com')
            .set('Content-Type', 'application/json')
            .expect(200)
            .then((response: any) => {
                expect(response.body.students.length).toBe(2);
                expect(response.body.students).toContain(commonStudents.students[0]);
            });
    });

    test('should return common students for 2 teacher', async () => {
        await superTestRequest(app)
            .get('/api/commonstudents?teacher=teacher1@testacademy.com&teacher=teacher2@testacademy.com')
            .set('Content-Type', 'application/json')
            .expect(200)
            .then((response: any) => {
                expect(response.body.students.length).toBe(1);
                expect(response.body.students).toContain(commonStudents.students[1]);
            });
    });

    test('should return no students for 1 teacher + 1 invalid teacher', async () => {
        await superTestRequest(app)
            .get('/api/commonstudents?teacher=teacher1@testacademy.com&teacher=teacher@testacademy.com')
            .set('Content-Type', 'application/json')
            .expect(200)
            .then((response: any) => {
                expect(response.body.students.length).toBe(0);
            });
    });

    test('should return students for teacher1 if all other teacher field is empty', async () => {
        await superTestRequest(app)
            .get('/api/commonstudents?teacher=teacher1@testacademy.com&teacher=&teacher')
            .set('Content-Type', 'application/json')
            .expect(200)
            .then((response: any) => {
                expect(response.body.students.length).toBe(2);
                expect(response.body.students).toContain(commonStudents.students[0]);
            });
    });

    test('should return invalid with missing teacher query', async () => {
        await superTestRequest(app)
            .get('/api/commonstudents?principal=teacher1@testacademy.com')
            .set('Content-Type', 'application/json')
            .expect(400)
            .then((response: any) => {
                expect(response.body.message).toBe("Invalid request received")
            });
    });
})

describe('GET /api/suspend', () => {
    let student = {
        "student": "DDD@testacademy.com"
    }

    test('should return invalid with invalid student', async () => {
        await superTestRequest(app)
            .post('/api/suspend')
            .set('Content-Type', 'application/json')
            .send({ "student": "ZZZ@testacademy.com" })
            .expect(400)
            .then((response: any) => {
                expect(response.body.message).toBe("Invalid Student")
            });
    });

    test('should return 204 with valid student', async () => {
        await superTestRequest(app)
            .post('/api/suspend')
            .set('Content-Type', 'application/json')
            .send(student)
            .expect(204)
    });

    test('should return suspended if student has been suspended', async () => {
        await superTestRequest(app)
            .post('/api/suspend')
            .set('Content-Type', 'application/json')
            .send(student)
            .expect(200)
            .then((response: any) => {
                expect(response.body.message).toBe("Student is already suspended");
            });
    });
})


describe('GET /api/retrievefornotifications', () => {
    let teacher = "teacher1@testacademy.com"
    let invalidStudent = "test@gmail.com";
    let studentNotUnderTeacher = "ryan@testacademy.com";
    let suspendedStudent = "AAA@testacademy.com";

    test('should return studentNotUnderTeacher if additional student is mentioned', async () => {
        await superTestRequest(app)
            .post('/api/retrievefornotifications')
            .set('Content-Type', 'application/json')
            .send({
                "teacher": teacher,
                "notification": "Hello! @" + studentNotUnderTeacher
            })
            .expect(200)
            .then((response: any) => {
                expect(response.body.recipients.length).toBe(3);
                expect(response.body.recipients).toContain(studentNotUnderTeacher);
            });
    });

    test('should return only students under teacher if invalidStudent mentioned', async () => {
        await superTestRequest(app)
            .post('/api/retrievefornotifications')
            .set('Content-Type', 'application/json')
            .send({
                "teacher": teacher,
                "notification": "Hello! @" + invalidStudent
            })
            .expect(200)
            .then((response: any) => {
                expect(response.body.recipients.length).toBe(2);
                expect(response.body.recipients).not.toContain(invalidStudent);
            });
    });

    test('should not return suspendedStudent if student mentioned has been suspended)', async () => {
        await superTestRequest(app)
            .post('/api/retrievefornotifications')
            .set('Content-Type', 'application/json')
            .send({
                "teacher": teacher,
                "notification": "Hello! @" + suspendedStudent + " @" + studentNotUnderTeacher
            })
            .expect(200)
            .then((response: any) => {
                expect(response.body.recipients.length).toBe(3);
                expect(response.body.recipients).toContain(studentNotUnderTeacher);
            });
    });

    test('should return invalid with missing teacher param', function () {
        return superTestRequest(app)
            .post('/api/retrievefornotifications')
            .set('Content-Type', 'application/json')
            .send({
                "notification": "Hello!"
            })
            .expect(400)
            .then(response => {
                expect(response.body.message).toBe("Invalid request received");
            })
    });

    test('should return invalid with unknown teacher', function () {
        return superTestRequest(app)
            .post('/api/retrievefornotifications')
            .set('Content-Type', 'application/json')
            .send({
                "teacher": "jack@testacademy.com",
                "notification": "hello!"
            })
            .expect(403)
            .then(response => {
                expect(response.body.message).toBe("Invalid Teacher");
            })
    });
})

