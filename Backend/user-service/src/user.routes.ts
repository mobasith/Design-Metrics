import { Router, Request, Response } from 'express';
import userController from './user.controller';
import axios from 'axios';
import multer from 'multer';
import FormData from 'form-data';

const router = Router();
const upload = multer();

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
        formData.append('createdById', createdById); // Keep this as string
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
        const response = await axios.get('http://localhost:5000/api/designs'); // Adjust the URL based on your setup
        // Format the response to return only design title, description, and created by name
        const formattedResponse = response.data.map((design: any) => ({
            designTitle: design.designTitle,
            description: design.description,
            createdByName: design.createdByName,
            design:design.designInput // Only return the createdByName
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

export default router;
