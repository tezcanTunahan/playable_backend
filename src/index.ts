import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./config/dbConnect";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();
dotenv.config();

app.use(
  cors({
    credentials: true,
  })
);
app.use(express.json());
app.use(compression());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the playable studycase API!");
});

app.use(errorMiddleware);

const server = http.createServer(app);

const PORT = process.env.PORT || 8081;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

dbConnect();
