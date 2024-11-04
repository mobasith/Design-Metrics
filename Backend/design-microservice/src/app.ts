import express from "express";
import connectDB from "./config/db";
import designRoutes from "./routes/designRoutes";
import dotenv from "dotenv";
import cors from "cors"; // Import the cors package

dotenv.config();
const app = express();

// Connect to the database
connectDB();

// Enable CORS for all origins
app.use(cors()); // This will allow all origins to access your API

// If you want to allow only specific origins, you can do it like this:
// app.use(cors({
//   origin: 'http://localhost:3000' // Only allow requests from this origin
// }));

app.use(express.json());
app.use("/api/designs", designRoutes);

// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
