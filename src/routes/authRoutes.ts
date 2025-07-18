import express from "express";
import authService, { login, register } from "../services/authService";
import { asyncErrorHandler } from "../middlewares/error.middleware";

const router = express.Router();

router.post("/register", asyncErrorHandler(authService.register));
router.post("/login", asyncErrorHandler(authService.login));

export default router;
