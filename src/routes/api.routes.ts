import { Router } from "express";
import { registerStudents, getCommonStudents, suspendStudent, getNotificationUsers } from "../controllers/api.controller";

const apiRoutes = Router();

apiRoutes.route("/register").post(registerStudents);
apiRoutes.route("/commonstudents").get(getCommonStudents);
apiRoutes.route("/suspend").post(suspendStudent);
apiRoutes.route("/retrievefornotifications").post(getNotificationUsers);

export { apiRoutes };
