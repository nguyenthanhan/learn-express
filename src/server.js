import express from "express";
import configViewEngine from "./config/viewEngine.js";
import path from "path";
import env from "./config/env.js";
import WebRouters from "./routes/web.js";
import ApiRoutes from "./routes/api.js";
import createMongoConn, { mongoIsConnected } from "./config/mongo.js";
import { pool } from "./config/mysql.js";
import fileUpload from "express-fileupload";
import fs from "fs";
import cors from "cors";

const startServer = async () => {
  try {
    const mongoose = await createMongoConn();

    const app = express();

    const port = env.PORT;
    const hostname = env.HOSTNAME;
    const apiVersion = env.API_VERSION;

    // Read and parse package.json
    const packageJsonPath = path.join(process.cwd(), "package.json");
    let packageJson;
    try {
      packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      console.log("App Version:", packageJson.version);
    } catch (error) {
      console.error("Failed to read or parse package.json", error);
      process.exit(1);
    }

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

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    const logAfterApiCall = (req, res, next) => {
      const start = Date.now();

      // Add request timestamp
      req.requestTime = new Date().toISOString();

      // Override end to calculate duration
      const originalEnd = res.end;
      res.end = function () {
        const duration = Date.now() - start;
        console.log(
          `[${req.requestTime}] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - Duration: ${duration}ms`
        );
        originalEnd.apply(res, arguments);
      };

      next();
    };
    app.use(logAfterApiCall);

    app.use("/", WebRouters);
    app.use(`/api/${apiVersion}`, ApiRoutes);

    const server = app.listen(port, hostname, () => {
      console.log(`${packageJson.name} app listening on port ${port}`);
    });

    const gracefulShutdown = async () => {
      console.log("Shutting down gracefully...");
      if (pool.close) {
        await pool.close();
      }
      if (mongoIsConnected()) {
        await mongoose.connection.close();
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
