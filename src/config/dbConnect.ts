import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const MONGO_URL = process.env.DATABASE_URL;
    const connect = await mongoose.connect(MONGO_URL);
    console.log(
      `MongoDB connected: ${connect.connection.host}, ${connect.connection.name}`
    );
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default dbConnect;
