import express, { type Response, type Request } from "express";

import { verifyToken } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import {
  createProduct,
  deleteProduct,
  getProdcuts,
  getProductById,
  setActiveProduct,
  updateProduct,
} from "../services/productService.js";
import { ProductRequestDto } from "../dtos/request/productRequestDto.js";
import { asyncErrorHandler } from "../middlewares/errorMiddleware.js";

const router = express.Router();

router.get(
  "/",
  verifyToken,
  authorizeRoles("admin", "user"),
  asyncErrorHandler(
    async (
      req: Request<
        {},
        {},
        {},
        {
          page?: string;
          pageSize?: string;
          search?: string;
          minPrice?: string;
          maxPrice?: string;
          sortBy?: "price" | "title" | "createdAt";
          sortOrder?: "asc" | "desc";
        }
      >,
      res: Response
    ) => {
      const { maxPrice, minPrice, search, sortBy, sortOrder } = req.query;
      const page = Number(req.query.page) || 1;
      const pageSize = Number(req.query.pageSize) || 10;

      const prodcuts = await getProdcuts(
        page,
        pageSize,
        search,
        minPrice,
        maxPrice,
        sortBy,
        sortOrder
      );
      res.status(200).json(prodcuts);
    }
  )
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

router.get(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "user"),
  asyncErrorHandler(async (req: Request<{ id?: string }>, res: Response) => {
    const { id } = req.params;
    const prodcut = await getProductById(id);
    res.status(200).json(prodcut);
  })
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  asyncErrorHandler(async (req: Request<{ id?: string }>, res: Response) => {
    const { id } = req.params;
    await deleteProduct(id);
    return res.status(200).json({ message: "Product deleted successfully" });
  })
);

router.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  asyncErrorHandler(
    async (
      req: Request<{ id?: string }, any, ProductRequestDto>,
      res: Response
    ) => {
      const { id } = req.params;
      await updateProduct(req.body, id);
      return res.status(200).json({ message: "Product updated successfully" });
    }
  )
);

router.patch(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  asyncErrorHandler(
    async (
      req: Request<{ id?: string }, any, { active: boolean }>,
      res: Response
    ) => {
      const { id } = req.params;
      await setActiveProduct(req.body.active, id);
      return res
        .status(200)
        .json({ message: "Product  change activity succecfully" });
    }
  )
);

export default router;
