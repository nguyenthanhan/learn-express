import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import env from "./environment.js";

const app = express();
const port = env.PORT;
const hostname = env.HOSTNAME;

// Get the filename of the current module
const __filename = fileURLToPath(import.meta.url);
// Get the directory name of the current module
const __dirname = dirname(__filename);
// Set the views directory
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("sample.ejs");
});

app.listen(port, hostname, () => {
  console.log(`Example app listening on port ${port}`);
});
