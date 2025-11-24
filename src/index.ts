import express from "express";
import dotenv from "dotenv";
import { dbConnect } from "./configs/dbConnect.js";
import authController from "./controllers/authController.js";
import usersController from "./controllers/userController.js";
import productsController from "./controllers/productsController.js";

import cors from "cors";
import { errorHandler } from "./middlewares/errorMiddleware.js";

dotenv.config();
dbConnect();
const PORT = process.env.PORT || 8081;

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use("/auth", authController);
app.use("/users", usersController);
app.use("/products", productsController);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// error middleware must be placed at the end, after all routes.
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});
