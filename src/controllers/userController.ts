import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/admin", verifyToken, (req, res) => {
  res.json("admin route");
});

router.get("/user", (req, res) => {
  res.json("user route");
});

export default router;
