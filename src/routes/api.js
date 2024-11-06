import express from "express";

const router = express.Router();

router.use((req, res, next) => {
  console.log("", new Date());
  next();
});

router.get("/", (req, res) => {
  res.json({
    message: "Hello World",
  });
});

router.get("/create", (req, res) => {
  res.json({
    message: "create World",
  });
});

export default router;
