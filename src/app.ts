import cors from "cors";
import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import { apiRoutes } from "./routes/api.routes";

const ROUTE_NOT_FOUND = "Route does not exist on the server";
export const app = express();
var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//routes for app
app.get("/", (req: Request, res: Response) => {
  res.status(200).send({ message: "Welcome to Academy API v1.0" });
});
app.use("/api", apiRoutes);
app.all("*", (req: Request, res: Response) => {
  res.status(404).send({ message: ROUTE_NOT_FOUND });
})
