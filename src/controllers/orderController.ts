import express, { type Request, type Response } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { asyncErrorHandler } from "../middlewares/errorMiddleware.js";
import { CustomError } from "../errors/customError.js";
import {
  createOrder,
  getOrders,
  getOrdersByUserId,
} from "../services/orderService.js";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  authorizeRoles("user"),
  asyncErrorHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    if (!userId) throw new CustomError(403, "no user Id");
    await createOrder(userId);
    res.status(200).json({ message: "order created" });
  })
);

router.get(
  "/",
  verifyToken,
  authorizeRoles("user"),
  asyncErrorHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    if (!userId) throw new CustomError(403, "no user Id");
    const orders = await getOrdersByUserId(userId);
    res.status(200).json(orders);
  })
);

router.get(
  "/admin",
  verifyToken,
  authorizeRoles("admin"),
  asyncErrorHandler(async (req: Request, res: Response) => {
    const orders = await getOrders();
    res.status(200).json(orders);
  })
);

export default router;
