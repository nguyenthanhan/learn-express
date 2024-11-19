import express from "express";
import {
  getUsersApi,
  createUserApi,
  getUserByIdApi,
  deleteUserApi,
  editUserApi,
} from "../controllers/apiController.js";
import { uploadFileApi } from "../controllers/uploadApiController.js";

const router = express.Router();

router.use((req, res, next) => {
  console.log("Api Router", new Date());
  next();
});

// MARK: - Users
router.get("/users", getUsersApi);
router.get("/users/:id", getUserByIdApi);
router.post("/users/", createUserApi);
router.put("/users/:id", editUserApi);
router.delete("/users/:id", deleteUserApi);

// MARK: - File Upload
router.post("/upload", uploadFileApi);

export default router;
