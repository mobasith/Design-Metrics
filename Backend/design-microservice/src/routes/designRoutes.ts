// designRoutes.ts
import express from 'express';
import { createDesign, getDesignById, getDesigns, getDesignsByUserId, addComment, getDesignComments } from '../controllers/designController';
import multer from 'multer';
import path from 'path';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../../uploads");
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Update the routes order - more specific routes should come first
router.get("/user/me", authMiddleware, (req, res) => getDesignsByUserId(req, res) as any); // Add this route
router.get("/:designId", (req, res) => getDesignById(req, res) as any);
router.get("/", (req, res) => getDesigns(req, res) as any);

router.post(
  "/",
  authMiddleware,
  upload.single("designInput"),
  (req, res) => createDesign(req, res) as any
);

router.post('/comments/:designId', authMiddleware, (req, res) => addComment(req, res) as any);
router.get('/getcomments/:designId', (req, res) => getDesignComments(req, res) as any);

export default router;