"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// designRoutes.ts
const express_1 = __importDefault(require("express"));
const designController_1 = require("../controllers/designController");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const dir = path_1.default.join(__dirname, "../../uploads");
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage });
// Update the routes order - more specific routes should come first
router.get("/user/me", authMiddleware_1.default, (req, res) => (0, designController_1.getDesignsByUserId)(req, res)); // Add this route
router.get("/:designId", (req, res) => (0, designController_1.getDesignById)(req, res));
router.get("/", (req, res) => (0, designController_1.getDesigns)(req, res));
router.post("/", authMiddleware_1.default, upload.single("designInput"), (req, res) => (0, designController_1.createDesign)(req, res));
router.post('/comments/:designId', authMiddleware_1.default, (req, res) => (0, designController_1.addComment)(req, res));
router.get('/getcomments/:designId', (req, res) => (0, designController_1.getDesignComments)(req, res));
exports.default = router;
