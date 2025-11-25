import express, { type Response, type Request } from "express";

import { verifyToken } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { createProduct, getProdcuts } from "../services/productService.js";
import { ProductRequestDto } from "../dtos/request/productRequestDto.js";
import { asyncErrorHandler } from "../middlewares/errorMiddleware.js";

const router = express.Router();

router.get(
  "/",
  verifyToken,
  authorizeRoles("admin", "user"),
  asyncErrorHandler(async (req: Request, res: Response) => {
    const prodcuts = await getProdcuts(1, 10);
    res.status(200).json(prodcuts);
  })
);

router.post(
  "/",
  verifyToken,
  authorizeRoles("admin"),
  asyncErrorHandler(
    async (req: Request<{}, {}, ProductRequestDto>, res: Response) => {
      await createProduct(req.body);
      return res.status(200).json({ message: "Product created successfully" });
    }
  )
);

export default router;
