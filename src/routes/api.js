import express from "express";
import {
  getUsersApi,
  createUserApi,
  getUserByIdApi,
  deleteUserApi,
  editUserApi,
  getDeletedUsersApi,
  restoreUserApi,
} from "../controllers/apiController.js";
import {
  uploadFileApi,
  getImageInfoApi,
} from "../controllers/uploadApiController.js";

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
router.get("/users/deleted", getDeletedUsersApi);
router.patch("/users/:id", restoreUserApi);

// MARK: - File Upload
router.post("/upload", uploadFileApi);
router.get("/upload/info/", getImageInfoApi);

export default router;
