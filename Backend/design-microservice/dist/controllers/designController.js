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
    const { designId, designTitle, description, createdById, createdByName } = req.body;
    const designInput = req.file; // File from the request
    try {
        // Upload the image to Cloudinary
        const uploadResult = yield cloudinaryConfig_1.default.uploader.upload(designInput.path, {
            folder: 'designs', // Optional: specify a folder in Cloudinary
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
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});
exports.createDesign = createDesign;
const getDesigns = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const designs = yield designModel_1.default.find();
        res.status(200).json(designs);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});
exports.getDesigns = getDesigns;
//get design by id 
const getDesignById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Change to match the route parameter
    try {
        const design = yield designModel_1.default.findById(id); // Use id instead of designId
        if (!design) {
            return res.status(404).json({ message: 'Design not found.' });
        }
        res.status(200).json(design);
    }
    catch (error) {
        console.error(error); // Log the error for debugging
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});
exports.getDesignById = getDesignById;
// New method to get designs by createdById
const getDesignsByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const designs = yield designModel_1.default.find({ createdById: userId }); // Adjust field name if necessary
        if (designs.length === 0) {
            return res.status(404).json({ message: 'No designs found for this user.' });
        }
        res.status(200).json(designs);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});
exports.getDesignsByUserId = getDesignsByUserId;
// Update method remains unchanged
const updateDesign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { designId } = req.params;
    const { designInput, designTitle, description } = req.body;
    try {
        const updatedDesign = yield designModel_1.default.findByIdAndUpdate(designId, { designInput, designTitle, description }, { new: true });
        if (!updatedDesign) {
            return res.status(404).json({ message: 'Design not found' });
        }
        res.status(200).json(updatedDesign);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
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
