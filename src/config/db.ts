import { connect, set } from "mongoose";
import secrets from "./secret";

set("strictQuery", false);

const connectDB = async () => {
  try {
    await connect(secrets.MONGO_URL);
    console.log("mongodb connection success!");
  } catch (err) {
    console.log("mongodb connection failed!", err);
  }
};

export default connectDB;
