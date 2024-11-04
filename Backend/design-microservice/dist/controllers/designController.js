"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDesign = exports.getDesignsByUserId = exports.getDesignById = exports.getDesigns = exports.createDesign = void 0;
const designModel_1 = __importDefault(require("../models/designModel"));
const cloudinaryConfig_1 = __importDefault(require("../config/cloudinaryConfig"));
const createDesign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { designId, designTitle, description, createdById, createdByName } = req.body;
    const designInput = req.file; // File from the request
    try {
        // Upload the image to Cloudinary
        const uploadResult = yield cloudinaryConfig_1.default.uploader.upload(designInput.path, {
            folder: "designs",
        });
        // Create a new design object with the Cloudinary URL
        const newDesign = new designModel_1.default({
            designId,
            designInput: uploadResult.secure_url, // Cloudinary image URL
            designTitle,
            description,
            createdById,
            createdByName,
        });
        yield newDesign.save();
        res.status(201).json(newDesign);
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "An unknown error occurred",
        });
    }
});
exports.createDesign = createDesign;
const getDesigns = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const designs = yield designModel_1.default.find();
        res.status(200).json(designs);
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "An unknown error occurred",
        });
    }
});
exports.getDesigns = getDesigns;
// Get design by designId
const getDesignById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { designId } = req.params;
    try {
        const design = yield designModel_1.default.findOne({ designId }); // Use findOne and filter by designId
        if (!design) {
            return res.status(404).json({ message: "Design not found." });
        }
        res.status(200).json(design);
    }
    catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({
            message: error instanceof Error ? error.message : "An unknown error occurred",
        });
    }
});
exports.getDesignById = getDesignById;
// New method to get designs by createdById
const getDesignsByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const designs = yield designModel_1.default.find({ createdById: userId });
        if (designs.length === 0) {
            return res
                .status(404)
                .json({ message: "No designs found for this user." });
        }
        res.status(200).json(designs);
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "An unknown error occurred",
        });
    }
});
exports.getDesignsByUserId = getDesignsByUserId;
// Update method remains unchanged
const updateDesign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { designId } = req.params;
    const { designInput, designTitle, description } = req.body;
    try {
        const updatedDesign = yield designModel_1.default.findOneAndUpdate({ designId }, // Find by designId instead of _id
        { designInput, designTitle, description }, { new: true });
        if (!updatedDesign) {
            return res.status(404).json({ message: "Design not found" });
        }
        res.status(200).json(updatedDesign);
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "An unknown error occurred",
        });
    }
});
exports.updateDesign = updateDesign;
