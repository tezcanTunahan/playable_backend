import express from "express";
import dotenv from "dotenv";
import { dbConnect } from "./configs/dbConnect.js";
import authController from "./controllers/authController.js";
import usersController from "./controllers/userController.js";

dotenv.config();
dbConnect();
const PORT = process.env.PORT || 8081;

const app = express();

app.use(express.json());
app.use("/auth", authController);
app.use("/users", usersController);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});
