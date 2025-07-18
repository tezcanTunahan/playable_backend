import express from "express";
import { login, register } from "../services/authService";
import { asyncErrorHandler } from "../middlewares/error.middleware";

const router = express.Router();

router.post("/register", asyncErrorHandler(register));
router.post("/login", asyncErrorHandler(login));

export default router;
