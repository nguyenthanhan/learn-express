import express from "express";
import configViewEngine from "./config/viewEngine.js";
import path from "path";
import env from "./config/env.js";
import WebRouters from "./routes/web.js";
import ApiRoutes from "./routes/api.js";
import createMongoConn from "./config/mongo.js";
import { pool } from "./config/mysql.js";
import fileUpload from "express-fileupload";

const startServer = async () => {
  try {
    const mongoose = await createMongoConn();

    const app = express();

    const port = env.PORT;
    const hostname = env.HOSTNAME;
    const apiVersion = env.API_VERSION;

    const dirname = path.dirname(new URL(import.meta.url).pathname);
    configViewEngine(app, dirname);

    app.use(
      fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 },
        useTempFiles: true,
        createParentPath: true,
        tempFileDir: "/tmp/",
      })
    );

    app.use(express.json()); // Add this line to parse JSON request bodies
    app.use(express.urlencoded({ extended: true })); // Add this line to parse URL-encoded request bodies

    app.use("/", WebRouters);
    app.use(`/api/${apiVersion}`, ApiRoutes);

    const server = app.listen(port, hostname, () => {
      console.log(`Example app listening on port ${port}`);
    });

    const gracefulShutdown = async () => {
      console.log("Shutting down gracefully...");
      if (pool.close) {
        await pool.close();
      }
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    };
    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);
  } catch (error) {
    console.log("Start Server Fail", error);
  }
};

startServer();
