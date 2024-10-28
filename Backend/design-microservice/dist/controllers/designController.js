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
exports.updateDesign = exports.getDesigns = exports.createDesign = void 0;
const designModel_1 = __importDefault(require("../models/designModel"));
const createDesign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { designId, designTitle, description, createdById, createdByName } = req.body;
    const designInput = req.file; // File from the request
    try {
        // Create a new design object
        const newDesign = new designModel_1.default({
            designId,
            designInput: designInput ? designInput.path : null, // Save the file path
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
// i want to create endpoijnt for update
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
