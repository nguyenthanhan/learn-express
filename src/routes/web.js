import express from "express";

const router = express.Router();

router.use((req, res, next) => {
  console.log("", new Date());
  next();
});

router.get("/", (req, res) => {
  res.render("sample.ejs");
});

router.get("/about", (req, res) => {
  res.json({
    message: "Hello World",
  });
});

export default router;
