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
const user_model_1 = __importDefault(require("./user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
class UserController {
    constructor() {
        // Validation for registration inputs
        this.registerValidation = [
            (0, express_validator_1.body)("email").isEmail().withMessage("Invalid email format"),
            (0, express_validator_1.body)("password")
                .isLength({ min: 8 })
                .withMessage("Password must be at least 8 characters long")
                .matches(/[A-Z]/)
                .withMessage("Password must contain at least one uppercase letter")
                .matches(/[a-z]/)
                .withMessage("Password must contain at least one lowercase letter")
                .matches(/\d/)
                .withMessage("Password must contain at least one number")
                .matches(/[@$!%*?&#]/)
                .withMessage("Password must contain at least one special character"),
        ];
        // Validation for login inputs
        this.loginValidation = [
            (0, express_validator_1.body)("email").isEmail().withMessage("Invalid email format"),
            (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"),
        ];
    }
    //registration method
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                console.log("Validation errors:", errors.array()); // Add this line to debug
                return res.status(400).json({ errors: errors.array() });
            }
            try {
                const { userId, userName, email, password, roleId } = req.body;
                // Check if the user already exists
                const existingUser = yield user_model_1.default.findOne({ email });
                if (existingUser) {
                    return res.status(400).json({ message: "User already exists" });
                }
                const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
                const user = new user_model_1.default({
                    userId,
                    userName,
                    email,
                    password: hashedPassword,
                    roleId,
                });
                yield user.save();
                res.status(201).json(user);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
    // Login method
    // In user.controller.ts - replacing the existing login method
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const user = yield user_model_1.default.findOne({ email });
                if (!user || !(yield bcryptjs_1.default.compare(password, user.password))) {
                    return res.status(401).json({ message: "Invalid credentials" });
                }
                // Create an enhanced token payload with user details
                const tokenPayload = {
                    userId: user.userId,
                    userName: user.userName,
                    email: user.email,
                    roleId: user.roleId
                };
                const token = jsonwebtoken_1.default.sign(tokenPayload, process.env.JWT_SECRET || "your_jwt_secret", { expiresIn: "1h" });
                // Return token along with user details
                res.json({
                    token,
                    user: {
                        userId: user.userId,
                        userName: user.userName,
                        email: user.email,
                        roleId: user.roleId
                    }
                });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_model_1.default.find();
                res.json(users);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    getOneUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            try {
                const user = yield user_model_1.default.findOne({ userId });
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                res.json(user);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params; // Get userId from route parameters
            const updates = req.body; // Get the updates from the request body
            try {
                const user = yield user_model_1.default.findOneAndUpdate({ userId }, updates, {
                    new: true,
                });
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                res.json(user);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            try {
                const user = yield user_model_1.default.findOneAndDelete({ userId });
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                res.status(204).send(); // No content to send back
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
}
exports.default = new UserController();
