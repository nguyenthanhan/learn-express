import mongoose from "mongoose";
import env from "./env.js";

const createMongoConn = async () => {
  try {
    await mongoose.connect(env.MONGODB_URL, {
      user: env.MONGODB_USER,
      pass: env.MONGODB_PASSWORD,
      connectTimeoutMS: 10000,
      dbName: env.MONGODB_DB,
    });
    console.log("MongoDB readyState: ", mongoose.connection.readyState);
    return mongoose;
  } catch (error) {
    throw error;
  }
};

export const mongoIsConnected = async () => {
  return mongoose.connection.readyState === 1;
};

export default createMongoConn;
