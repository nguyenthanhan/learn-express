import express from "express";
import {
  getUsersApi,
  createUserApi,
  getUserByIdApi,
  deleteUserApi,
  editUserApi,
  getDeletedUsersApi,
  restoreUserApi,
} from "../controllers/apiUserController.js";
import {
  uploadFileApi,
  getImageInfoApi,
} from "../controllers/uploadApiController.js";
import {
  createProjectApi,
  getProjectsApi,
} from "../controllers/apiProjectController.js";
import {
  addMemberToProjectApi,
  removeMemberFromProjectApi,
} from "../controllers/apiProjectMemberController.js";
import {
  getTasksApi,
  createTaskApi,
  updateTaskApi,
} from "../controllers/apiTaskController.js";

const router = express.Router();

router.use((req, res, next) => {
  // console.log("Api Router", new Date());
  next();
});

// MARK: - Users
router.get("/users", getUsersApi);
router.get("/users/deleted", getDeletedUsersApi);
router.get("/users/:id", getUserByIdApi);
router.post("/users/", createUserApi);
router.put("/users/:id", editUserApi);
router.delete("/users/:id", deleteUserApi);
router.patch("/users/:id", restoreUserApi);

// MARK: - Projects
router.get("/projects/", getProjectsApi);
router.post("/projects/", createProjectApi);

// MARK: - Project Members
router.post("/projects-members/add", addMemberToProjectApi);
router.post("/projects-members/remove", removeMemberFromProjectApi);

//MARK: - Tasks
router.get("/tasks", getTasksApi);
router.post("/tasks", createTaskApi);
router.patch("/tasks/:id", updateTaskApi);

// MARK: - File Upload
router.post("/upload", uploadFileApi);
router.get("/upload/info/", getImageInfoApi);

export default router;
