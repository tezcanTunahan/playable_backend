import express, { type Request } from "express";
import { login, register } from "../services/authService.js";
import { RegisterDto } from "../dtos/request/registerRequestDto.js";
import { LoginRequestDto } from "../dtos/request/loginRequestDto.js";
import { asyncErrorHandler } from "../middlewares/errorMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  asyncErrorHandler(async (req: Request<{}, {}, RegisterDto>, res) => {
    await register(req.body);
    res.status(201).json({ message: "User registered" });
  })
);

router.post(
  "/login",
  asyncErrorHandler(async (req: Request<{}, {}, LoginRequestDto>, res) => {
    const accessToken = await login(req.body);
    res.status(201).json({ accessToken });
  })
);

export default router;
