import express, { Request, Response } from "express";
import { asyncErrorHandler } from "../middlewares/error.middleware";
import { verifyToken } from "../middlewares/authMiddleware";
import { authorizeRole } from "../middlewares/roleMiddleware";
import userService from "../services/userService";

const router = express.Router();

router.get(
  "/me",
  verifyToken,
  asyncErrorHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const user = await userService.getUserById(userId);
    res.status(200).json({ user });
  })
);

router.get("/admin", verifyToken, authorizeRole(["admin"]), (req, res) => {
  res.json({ message: "Admin route accessed" });
});

router.get(
  "/user",
  verifyToken,
  authorizeRole(["user", "admin"]),
  (req, res) => {
    const id = (req as any).user.id;
    res.json({ message: "User route accessed" + id });
  }
);

router.get("/public", (req, res) => {
  res.json({ message: "public route accessed" });
});

export default router;
