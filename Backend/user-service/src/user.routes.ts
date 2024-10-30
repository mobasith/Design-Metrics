import { Router, Request, Response } from 'express';
import userController from './user.controller';
import axios from 'axios';
import multer from 'multer';
import FormData from 'form-data';
import xlsx from 'xlsx';
import fs from 'fs'; // Import fs to delete the uploaded file after processing

const router = Router();
const upload = multer({ dest: 'uploads/' }); // Use temporary storage for uploaded files

// User Registration and Login Routes
router.post('/register', (req: Request, res: Response) => userController.register(req, res) as any);
router.post('/login', (req: Request, res: Response) => userController.login(req, res) as any);
router.get('/', (req: Request, res: Response) => userController.getAllUsers(req, res));
router.put('/update/:userId', (req: Request, res: Response) => userController.updateUser(req, res) as any);
router.get('/:userId', (req: Request, res: Response) => userController.getOneUser(req, res) as any);
router.delete('/delete/:userId', (req: Request, res: Response) => userController.deleteUser(req, res) as any);

// New endpoint for creating a design
router.post('/designs', upload.single('designInput'), async (req: Request, res: Response) => {
    const { designId, designTitle, description, createdById, createdByName } = req.body;
    const designInput = req.file;

    try {
        const formData = new FormData();
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

        const response = await axios.post('http://localhost:5000/api/designs', formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });

        res.status(response.status).json(response.data);
    } catch (error: any) {
        console.error('Error posting design:', error);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});

// New endpoint to get all designs
router.get('/designs/getdesigns', async (req: Request, res: Response) => {
    try {
        const response = await axios.get('http://localhost:5000/api/designs');
        const formattedResponse = response.data.map((design: any) => ({
            designTitle: design.designTitle,
            description: design.description,
            createdByName: design.createdByName,
            design: design.designInput // Include the design input if needed
        }));
        res.status(response.status).json(formattedResponse);
    } catch (error: any) {
        console.error('Error fetching designs:', error);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});

// New endpoint to get designs by user ID
router.get('/designs/user/:userId', async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const response = await axios.get(`http://localhost:5000/api/designs/user/${userId}`);
        const formattedResponse = response.data.map((design: any) => ({
            designTitle: design.designTitle,
            description: design.description,
            createdByName: design.createdByName,
            design: design.designInput // Include the design input if needed
        }));
        res.status(response.status).json(formattedResponse);
    } catch (error: any) {
        console.error('Error fetching designs for user:', error);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});

// Endpoint to post feedback
router.post('/feedback/upload', upload.single('feedbackFile'), async (req: Request, res: Response):Promise<any>=> {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(req.file.path), {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        // Send file to feedback-service
        const response = await axios.post('http://localhost:3001/api/feedback/upload', formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });

        // Delete the temporary file after sending
        fs.unlinkSync(req.file.path);

        res.status(response.status).json(response.data);
    } catch (error: any) {
        console.error('Error uploading feedback file:', error);
        res.status(500).json({ error: 'An error occurred while uploading feedback' });
    }
});

// Endpoint to get all feedbacks
router.get('/feedback/getfeedbacks', async (req: Request, res: Response) => {
    try {
        // Make a GET request to the feedback service
        const response = await axios.get('http://localhost:3001/api/feedback');
        
        // Send back the response data to the client
        res.status(response.status).json(response.data);
    } catch (error: any) {
        console.error('Error fetching feedbacks:', error);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});

// New endpoint to get feedbacks by design ID
router.get('/feedbacks/design/:designId', async (req: Request, res: Response) => {
    const { designId } = req.params; // Extract designId from path parameters
    try {
        // Make a GET request to the feedback service, including designId as a query parameter
        const response = await axios.get(`http://localhost:3001/api/feedback/design/${designId}`);
        
        // Send back the response data to the client
        res.status(response.status).json(response.data);
    } catch (error: any) {
        console.error('Error fetching feedbacks by design ID:', error);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});



export default router;
