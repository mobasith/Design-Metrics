import express from 'express';
import { createDesign, getDesigns } from '../controllers/designController';

const router = express.Router();

// Define storage for uploaded files
import multer from 'multer';
import path from 'path';

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



router.post('/', upload.single('designInput'), createDesign);
router.get('/', getDesigns);


export default router;
