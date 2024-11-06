import express from "express";
import configViewEngine from "./config/viewEngine.js";
import path from "path";
import env from "./config/env.js";
import WebRouters from "./routes/web.js";
import ApiRoutes from "./routes/api.js";

const app = express();

const port = env.PORT;
const hostname = env.HOSTNAME;
const apiVersion = env.API_VERSION;

const dirname = path.dirname(new URL(import.meta.url).pathname);

configViewEngine(app, dirname);

app.use("/", WebRouters);
app.use(`/api/${apiVersion}`, ApiRoutes);

app.listen(port, hostname, () => {
  console.log(`Example app listening on port ${port}`);
});
