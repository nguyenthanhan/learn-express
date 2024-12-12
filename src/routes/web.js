import express from "express";
import {
  getHomepage,
  getAbout,
  getCreateUserPage,
  getEditUserPage,
  createUserAction,
  editUserAction,
  deleteUserAction,
} from "../controllers/homeController.js";

const router = express.Router();

router.use((req, res, next) => {
  // console.log("Web router", new Date());
  next();
});

router.get("/", getHomepage);
router.get("/createUser", getCreateUserPage);
router.post("/createUser", createUserAction);
router.get("/editUser/:id", getEditUserPage);
router.post("/editUser/:id", editUserAction);
router.post("/deleteUser/:id", deleteUserAction);

router.get("/about", getAbout);

export default router;
