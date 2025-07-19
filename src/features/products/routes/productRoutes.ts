import express, { Request, Response } from "express";
import { asyncErrorHandler } from "../../../middlewares/error.middleware";
import { verifyToken } from "../../../middlewares/authMiddleware";
import { authorizeRole } from "../../../middlewares/roleMiddleware";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  authorizeRole(["admin"]),
  asyncErrorHandler((req: Request, res: Response) => {
    res.json({ message: "Admin route accessed" });
  })
);

export default router;
