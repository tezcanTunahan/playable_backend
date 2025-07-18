import express, { Request, Response } from "express";
import { RegisterRequestDto, LoginRequestDto } from "../dto/authDto";

import authService from "../services/authService";
import { asyncErrorHandler } from "../middlewares/error.middleware";

const router = express.Router();

router.post(
  "/register",
  asyncErrorHandler(
    async (req: Request<{}, {}, RegisterRequestDto>, res: Response) => {
      await authService.register(req.body);
      res.status(201).json({
        message: "User registered successfully",
      });
    }
  )
);

router.post(
  "/login",
  asyncErrorHandler(
    async (req: Request<{}, {}, LoginRequestDto>, res: Response) => {
      const accessToken = await authService.login(req.body);
      res.status(200).json({ accessToken });
    }
  )
);

export default router;
