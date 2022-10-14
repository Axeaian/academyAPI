import { app } from "./app";
import { db } from "./db/mysql.config";
import http from "http";
import ip from "ip";
import { Student } from "./models/Student";
import { Teacher } from "./models/Teacher";

// Connect to Database
db.authenticate()
  .then(() => {
    console.log("DB connection has been established successfully.");
  })
  .catch((error: any) => {
    console.error("Unable to connect to the database: ", error);
  });

//Create tables required for DB
// const initiateTables = async () => {
Teacher.belongsToMany(Student, { as: "Student", through: 'TeacherToStudent' });
Student.belongsToMany(Teacher, { as: "Teacher", through: 'TeacherToStudent' });
db.sync();

//   console.log("All models were synchronized successfully.");
// }
// initiateTables();


// Start App
const APPLICATION_RUNNING = "application is running on: ";
const port: string | number = process.env.SERVER_PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
console.info(`${APPLICATION_RUNNING} ${ip.address()}:${port}`);
const server = http.createServer(app);