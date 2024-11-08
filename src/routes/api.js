import express from "express";
import {
  getUsersApi,
  createUserApi,
  getUserByIdApi,
  deleteUserApi,
} from "../controllers/apiController.js";

const router = express.Router();

router.use((req, res, next) => {
  console.log("Api Router", new Date());
  next();
});

router.get("/users", getUsersApi);

router.get("/users/:id", getUserByIdApi);

router.post("/users", createUserApi);

router.delete("/users/:id", deleteUserApi);

export default router;
