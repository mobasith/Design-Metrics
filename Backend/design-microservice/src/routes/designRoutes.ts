import express from 'express';
import { createDesign, getDesignById, getDesigns, getDesignsByUserId } from '../controllers/designController';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Define storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../../uploads'); // Adjust the path as needed
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename
    },
});

const upload = multer({ storage });

// Endpoint to create a new design
router.post('/', upload.single('designInput'), (req, res) => createDesign(req, res) as any);

// Endpoint to get all designs
router.get('/', (req, res) => getDesigns(req, res) as any);

// Endpoint to get design by desingId
router.get('/:id', (req,res) => getDesignById(req, res) as any);

// Endpoint to get designs by a specific user ID
router.get('/user/:userId', (req, res) => getDesignsByUserId(req, res) as any);

export default router;
