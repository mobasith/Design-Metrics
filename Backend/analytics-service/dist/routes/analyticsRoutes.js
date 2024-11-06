"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analyticsController_1 = __importDefault(require("../controllers/analyticsController"));
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: 'uploads/' }); // Configure storage location for uploaded files
router.post('/upload', upload.single('file'), (req, res) => {
    analyticsController_1.default.uploadFeedback(req, res);
});
// New routes
router.get('/all', (req, res) => {
    analyticsController_1.default.getAllAnalytics(req, res);
});
router.get('/user/:userId', (req, res) => {
    analyticsController_1.default.getAnalyticsByUserId(req, res);
});
exports.default = router;
