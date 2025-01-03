import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import connectDB from "./config/db";
import secrets from "./config/secret";
import middleware from "./shared/middleware";
import routes from "./shared/route";
import logger from "node-color-log";

const app = express();
const PORT = secrets.PORT;

// welcome message
app.get("/", async (_, res) => {
  res.send("Welcome to API");
});

// implement middleware
app.use(middleware);

app.use((req, res, next) => {
  let send = res.send;
  res.send = c => {
    logger.color('blue').bgColor('black')
      .bold().dim().reverse().log(req.body);

    logger.color('yellow').bgColor('black')
      .bold().dim().reverse().log(c);
    //console.log(`Code: ${res.statusCode}`);

    res.send = send;
    return res.send(c);
  }
  next();
});

// connect to database
connectDB();

// define routes
app.use("/api/v1", routes);

// catch global error
app.use((error: any, _req: Request, res: Response, _: NextFunction) => {
  logger.color('red').bgColor('black')
    .bold().dim().reverse().log(error.message);

  res.status(error.statusCode || 400).json({
    message: error.message,
  });
});

// listen to port
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

export default app;
