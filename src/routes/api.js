import express from "express";
import { getApi, createSomethingApi } from "../controllers/apiController.js";

const router = express.Router();

router.use((req, res, next) => {
  console.log("Api Router", new Date());
  next();
});

router.get("/", getApi);

router.get("/create", createSomethingApi);

export default router;
