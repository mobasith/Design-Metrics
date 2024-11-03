import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./user.routes";

dotenv.config();

const app = express();
app.use(express.json());

// Allow CORS from any origin
app.use(cors()); // No options needed to allow all origins

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/USERSDB";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
