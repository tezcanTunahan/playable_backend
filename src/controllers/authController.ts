import express, { type Request } from "express";
import { login, register } from "../services/authService.js";
import { RegisterDto } from "../dtos/request/registerRequestDto.js";
import { LoginRequestDto } from "../dtos/request/loginRequestDto.js";

const router = express.Router();

router.post("/register", async (req: Request<{}, {}, RegisterDto>, res) => {
  await register(req.body);
  res.status(201).json({ message: "User registered" });
});

router.post("/login", async (req: Request<{}, {}, LoginRequestDto>, res) => {
  const accessToken = await login(req.body);
  res.status(201).json({ accessToken });
});

export default router;
