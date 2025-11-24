import express, { type Response, type Request } from "express";

import { verifyToken } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { createProduct } from "../services/productService.js";
import { ProductRequestDto } from "../dtos/request/productRequestDto.js";

const router = express.Router();

router.get("/", verifyToken, authorizeRoles("admin", "user"), (req, res) => {
  res.json("products route");
});

router.post(
  "/",
  verifyToken,
  authorizeRoles("admin"),
  async (req: Request<{}, {}, ProductRequestDto>, res: Response) => {
    await createProduct(req.body);
    res.status(200);
  }
);

export default router;
