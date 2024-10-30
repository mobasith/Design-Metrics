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
const express_1 = require("express");
const user_controller_1 = __importDefault(require("./user.controller"));
const axios_1 = __importDefault(require("axios"));
const multer_1 = __importDefault(require("multer"));
const form_data_1 = __importDefault(require("form-data"));
const fs_1 = __importDefault(require("fs")); // Import fs to delete the uploaded file after processing
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: 'uploads/' }); // Use temporary storage for uploaded files
// User Registration and Login Routes
router.post('/register', (req, res) => user_controller_1.default.register(req, res));
router.post('/login', (req, res) => user_controller_1.default.login(req, res));
router.get('/', (req, res) => user_controller_1.default.getAllUsers(req, res));
router.put('/update/:userId', (req, res) => user_controller_1.default.updateUser(req, res));
router.get('/:userId', (req, res) => user_controller_1.default.getOneUser(req, res));
router.delete('/delete/:userId', (req, res) => user_controller_1.default.deleteUser(req, res));
// New endpoint for creating a design
router.post('/designs', upload.single('designInput'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { designId, designTitle, description, createdById, createdByName } = req.body;
    const designInput = req.file;
    try {
        const formData = new form_data_1.default();
        formData.append('designId', designId);
        formData.append('designTitle', designTitle);
        formData.append('description', description);
        formData.append('createdById', createdById);
        formData.append('createdByName', createdByName);
        if (designInput) {
            formData.append('designInput', designInput.buffer, {
                filename: designInput.originalname,
                contentType: designInput.mimetype,
            });
        }
        const response = yield axios_1.default.post('http://localhost:5000/api/designs', formData, {
            headers: Object.assign({}, formData.getHeaders()),
        });
        res.status(response.status).json(response.data);
    }
    catch (error) {
        console.error('Error posting design:', error);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        }
        else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}));
// New endpoint to get all designs
router.get('/designs/getdesigns', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get('http://localhost:5000/api/designs');
        const formattedResponse = response.data.map((design) => ({
            designTitle: design.designTitle,
            description: design.description,
            createdByName: design.createdByName,
            design: design.designInput // Include the design input if needed
        }));
        res.status(response.status).json(formattedResponse);
    }
    catch (error) {
        console.error('Error fetching designs:', error);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        }
        else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}));
// New endpoint to get designs by user ID
router.get('/designs/user/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const response = yield axios_1.default.get(`http://localhost:5000/api/designs/user/${userId}`);
        const formattedResponse = response.data.map((design) => ({
            designTitle: design.designTitle,
            description: design.description,
            createdByName: design.createdByName,
            design: design.designInput // Include the design input if needed
        }));
        res.status(response.status).json(formattedResponse);
    }
    catch (error) {
        console.error('Error fetching designs for user:', error);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        }
        else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}));
// Endpoint to post feedback
router.post('/feedback/upload', upload.single('feedbackFile'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    try {
        const formData = new form_data_1.default();
        formData.append('file', fs_1.default.createReadStream(req.file.path), {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });
        // Send file to feedback-service
        const response = yield axios_1.default.post('http://localhost:3001/api/feedback/upload', formData, {
            headers: Object.assign({}, formData.getHeaders()),
        });
        // Delete the temporary file after sending
        fs_1.default.unlinkSync(req.file.path);
        res.status(response.status).json(response.data);
    }
    catch (error) {
        console.error('Error uploading feedback file:', error);
        res.status(500).json({ error: 'An error occurred while uploading feedback' });
    }
}));
// Endpoint to get all feedbacks
router.get('/feedback/getfeedbacks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Make a GET request to the feedback service
        const response = yield axios_1.default.get('http://localhost:3001/api/feedback');
        // Send back the response data to the client
        res.status(response.status).json(response.data);
    }
    catch (error) {
        console.error('Error fetching feedbacks:', error);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        }
        else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}));
// New endpoint to get feedbacks by design ID
router.get('/feedbacks/design/:designId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { designId } = req.params; // Extract designId from path parameters
    try {
        // Make a GET request to the feedback service, including designId as a query parameter
        const response = yield axios_1.default.get(`http://localhost:3001/api/feedback/design/${designId}`);
        // Send back the response data to the client
        res.status(response.status).json(response.data);
    }
    catch (error) {
        console.error('Error fetching feedbacks by design ID:', error);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        }
        else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}));
exports.default = router;
