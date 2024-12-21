import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import connectDB from "./config/db";
import secrets from "./config/secret";
import Blacklist from "./model/blacklist.model";
import middleware from "./shared/middleware";
import routes from "./shared/route";
import { getBearerToken, verifyToken } from "./utils/token";
import bodyParser from "body-parser";

const app = express();
const PORT = secrets.PORT;

// Middleware to parse JSON data
app.use(bodyParser.json());

// Optionally, if you need to handle URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));
// connect to database
connectDB();

// define routes
app.use("/api/v1", routes);

// listen to port
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

export default app;
