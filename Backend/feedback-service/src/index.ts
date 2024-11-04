import express from "express";
import feedbackRoutes from "./routes/feedbackRoutes";
import connectDB from "./config/db";
import cors from "cors"; // Use ES6 import for consistency

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Apply CORS middleware
app.use(express.json());

// Use the feedback routes
app.use("/api/feedback", feedbackRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
