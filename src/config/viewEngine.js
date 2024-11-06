import path from "path";
import express from "express";

const configViewEngine = (app, dirname) => {
  app.set("views", path.join(dirname, "views"));
  app.set("view engine", "ejs");
  app.use(express.static(path.join(dirname, "public")));
};

export default configViewEngine;
