import { Request, Response } from "express";
import querystring from 'node:querystring';
import { ApiService } from "../services/api.services";


const apiService = new ApiService();
const logRequestInfo = (req: Request): void => {
  console.info(
    `[${new Date().toLocaleString()}] Incoming ${req.method} ${req.originalUrl} 
    Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`
  );
}

export const registerStudents = async (req: Request, res: Response) => {
  logRequestInfo(req);
  const teacherEmail = req.body.teacher;
  const studentsEmail = req.body.students;

  if (!teacherEmail || !studentsEmail || studentsEmail.length === 0) {
    return res.status(400).send({ message: "Invalid request received" })
  }

  apiService.registerStudents(teacherEmail, studentsEmail, res)
};

export const getCommonStudents = async (req: Request, res: Response) => {
  logRequestInfo(req);
  const urlParams = req.originalUrl.replace("/api/commonstudents?", "");
  const params = querystring.parse(urlParams);

  if (!params || params.teacher === undefined || params.teacher === "") {
    return res.status(400).send({ message: "Invalid request received" })
  }

  const teachers: Array<string> = Array.isArray(params.teacher) ? params.teacher : [params.teacher];

  apiService.getCommonStudents(teachers, res);
}

export const suspendStudent = async (req: Request, res: Response) => {
  logRequestInfo(req);
  const studentEmail = req.body.student;
  if (!studentEmail || Array.isArray(studentEmail)) {
    return res.status(400).send({ message: "Invalid request received" })
  }

  apiService.suspendStudent(studentEmail, res);
}

export const getNotificationUsers = async (req: Request, res: Response) => {
  logRequestInfo(req);
  const teacherEmail = req.body.teacher;
  const notification = req.body.notification;

  if (!teacherEmail || !notification) {
    return res.status(400).send({ message: "Invalid request received" })
  }

  apiService.getNotificationUsers(teacherEmail, notification, res)
}