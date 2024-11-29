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
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    console.log("MongoDB readyState: ", mongoose.connection.readyState);
    return mongoose;
  } catch (error) {
    throw error;
  }
};

export const mongoIsConnected = () => {
  return mongoose.connection.readyState === 1;
};

export default createMongoConn;
