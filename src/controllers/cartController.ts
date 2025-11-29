import express, { type Request, type Response } from "express";
import { asyncErrorHandler } from "../middlewares/errorMiddleware.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import {
  createCart,
  deleteCart,
  getCartByUserId,
} from "../services/cartService.js";
import { CartRequestDto } from "../dtos/request/cartRequsetDto.js";
import { CustomError } from "../errors/customError.js";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  authorizeRoles("user"),
  asyncErrorHandler(
    async (req: Request<{}, {}, CartRequestDto>, res: Response) => {
      const userId = req.user!.id;
      const cart = await createCart(userId, req.body);
      res.status(200).json(cart);
    }
  )
);

router.get(
  "/",
  verifyToken,
  authorizeRoles("user"),
  asyncErrorHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const cart = await getCartByUserId(userId);
    res.status(200).json(cart);
  })
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("user"),
  asyncErrorHandler(async (req: Request<{ id?: string }>, res: Response) => {
    const userId = req.user?.id;
    const id = req.params.id;
    if (!id) throw new CustomError(400, "Product ID missing");
    if (!userId) throw new CustomError(403, "no user Id");

    await deleteCart(userId, id);
    return res.status(200).json({ message: "Cart deleted successfully" });
  })
);

export default router;
