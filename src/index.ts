import { app } from "./app";
import http from "http";
import ip from "ip";

// Start App
const APPLICATION_RUNNING = "application is running on: ";
const port: string | number = process.env.SERVER_PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
console.info(`${APPLICATION_RUNNING} ${ip.address()}:${port}`);
const server = http.createServer(app);