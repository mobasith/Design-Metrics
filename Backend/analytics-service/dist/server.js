"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const analyticsRoutes_1 = __importDefault(require("./routes/analyticsRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ANALYTICSDB';
mongoose_1.default.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
app.use('/api/analytics', analyticsRoutes_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
