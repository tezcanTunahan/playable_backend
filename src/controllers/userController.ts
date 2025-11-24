import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { asyncErrorHandler } from "../middlewares/errorMiddleware.js";

const router = express.Router();

router.get(
  "/admin",
  verifyToken,
  authorizeRoles("admin"),
  asyncErrorHandler(async (req, res) => {
    res.status(200).json("admin route");
  })
);

router.get(
  "/user",
  verifyToken,
  authorizeRoles("admin", "user"),
  asyncErrorHandler(async (req, res) => {
    res.status(200).json("user route");
  })
);

export default router;
