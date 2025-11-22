import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/admin", verifyToken, authorizeRoles("admin"), (req, res) => {
  res.json("admin route");
});

router.get(
  "/user",
  verifyToken,
  authorizeRoles("admin", "user"),
  (req, res) => {
    res.json("user route");
  }
);

export default router;
