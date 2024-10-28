"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const designSchema = new mongoose_1.default.Schema({
    designId: { type: Number, required: true, unique: true },
    designInput: { type: String, required: true },
    designTitle: { type: String, required: true },
    description: { type: String },
    createdById: { type: Number, required: true },
    createdByName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
const Design = mongoose_1.default.model('Design', designSchema);
exports.default = Design;
