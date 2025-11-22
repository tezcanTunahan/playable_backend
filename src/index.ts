import express from "express";
import dotenv from "dotenv";
import { dbConnect } from "./configs/dbConnect.js";
import authRoute from "./routes/authRoutes.js";
import usersRoutes from "./routes/userRoutes.js";

dotenv.config();
dbConnect();
const PORT = process.env.PORT || 8081;

const app = express();

app.use(express.json());
app.use("/auth", authRoute);
app.use("/users", usersRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});
