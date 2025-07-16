import express from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import { authorizeRole } from "../middlewares/roleMiddleware";

const router = express.Router();

router.get("/admin", verifyToken, authorizeRole(["admin"]), (req, res) => {
  res.json({ message: "Admin route accessed" });
});

router.get(
  "/user",
  verifyToken,
  authorizeRole(["user", "admin"]),
  (req, res) => {
    res.json({ message: "User route accessed" });
  }
);

router.get("/public", (req, res) => {
  res.json({ message: "public route accessed" });
});

export default router;
