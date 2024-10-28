"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("./user.controller"));
const router = (0, express_1.Router)();
router.post('/register', (req, res) => user_controller_1.default.register(req, res));
router.post('/login', (req, res) => user_controller_1.default.login(req, res));
router.get('/', (req, res) => user_controller_1.default.getAllUsers(req, res));
router.put('/update/:userId', (req, res) => user_controller_1.default.updateUser(req, res));
router.get('/:userId', (req, res) => user_controller_1.default.getOneUser(req, res));
router.delete('/delete/:userId', (req, res) => user_controller_1.default.deleteUser(req, res));
exports.default = router;
