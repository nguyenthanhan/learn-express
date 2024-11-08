import express from "express";
import { getHomepage, getAbout } from "../controllers/homeController.js";

const router = express.Router();

router.use((req, res, next) => {
  console.log("Web router", new Date());
  next();
});

router.get("/", getHomepage);

router.get("/about", getAbout);

export default router;
