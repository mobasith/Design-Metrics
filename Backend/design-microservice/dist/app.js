"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const designRoutes_1 = __importDefault(require("./routes/designRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors")); // Import the cors package
dotenv_1.default.config();
const app = (0, express_1.default)();
// Connect to the database
(0, db_1.default)();
// Enable CORS for all origins
app.use((0, cors_1.default)()); // This will allow all origins to access your API
// If you want to allow only specific origins, you can do it like this:
// app.use(cors({
//   origin: 'http://localhost:3000' // Only allow requests from this origin
// }));
app.use(express_1.default.json());
app.use("/api/designs", designRoutes_1.default);
// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
