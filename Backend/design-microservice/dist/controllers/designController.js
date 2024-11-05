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
exports.getDesignComments = exports.addComment = exports.updateDesign = exports.getDesignsByUserId = exports.getDesignById = exports.getDesigns = exports.createDesign = void 0;
const designModel_1 = __importDefault(require("../models/designModel"));
const cloudinaryConfig_1 = __importDefault(require("../config/cloudinaryConfig"));
const CommentSchema_1 = __importDefault(require("../models/CommentSchema")); // Import Comment model
const createDesign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { designId, designTitle, description } = req.body;
    const designInput = req.file;
    try {
        if (!req.user) {
            throw new Error('User information not found in token');
        }
        if (!designInput) {
            throw new Error('No file uploaded');
        }
        if (!designId) {
            throw new Error('Design ID is required');
        }
        const uploadResult = yield cloudinaryConfig_1.default.uploader.upload(designInput.path, {
            folder: 'designs',
        });
        const newDesign = new designModel_1.default({
            designId: Number(designId), // Convert to number
            designInput: uploadResult.secure_url,
            designTitle,
            description,
            createdById: req.user.userId,
            createdByName: req.user.userName,
        });
        yield newDesign.save();
        res.status(201).json(newDesign);
    }
    catch (error) {
        console.error('Design creation error:', error);
        res.status(500).json({
            message: error instanceof Error ? error.message : 'An unknown error occurred',
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
// In your designController.ts
// designController.ts
const getDesignsByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId)) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const designs = yield designModel_1.default.find({ createdById: req.user.userId });
        return res.status(200).json(designs); // Return empty array if no designs found
    }
    catch (error) {
        console.error('Error in getDesignsByUserId:', error);
        return res.status(500).json({
            message: error instanceof Error ? error.message : 'An unknown error occurred',
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
//add a comment to a design , based on the design Id
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { designId } = req.params; // Use the designId from the route parameters
    const { userId, userName, commentText } = req.body;
    // Here, we assume designId is already a number and comes from the URL
    try {
        const newComment = new CommentSchema_1.default({
            designId: Number(designId), // Convert to number if needed
            userId,
            userName,
            commentText,
        });
        yield newComment.save();
        res.status(201).json(newComment);
    }
    catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
});
exports.addComment = addComment;
//get all the comments based on the design Id
const getDesignComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { designId } = req.params; // Use the designId from the route parameters
    try {
        const comments = yield CommentSchema_1.default.find({ designId: Number(designId) }); // Query using designId
        if (comments.length === 0) {
            return res.status(404).json({ message: 'No comments found for this design.' });
        }
        res.status(200).json(comments);
    }
    catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
});
exports.getDesignComments = getDesignComments;
