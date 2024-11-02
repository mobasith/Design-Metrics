import { Request, Response } from 'express';
import User, { IUser } from './user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';

class UserController {

    // Validation for registration inputs
    registerValidation = [
        body('email').isEmail().withMessage('Invalid email format'),
        body('password')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long')
            .matches(/[A-Z]/)
            .withMessage('Password must contain at least one uppercase letter')
            .matches(/[a-z]/)
            .withMessage('Password must contain at least one lowercase letter')
            .matches(/\d/)
            .withMessage('Password must contain at least one number')
            .matches(/[@$!%*?&#]/)
            .withMessage('Password must contain at least one special character')
    ];
    
    //registration method
    async register(req: Request, res: Response): Promise<any>{

        const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Validation errors:", errors.array()); // Add this line to debug
        return res.status(400).json({ errors: errors.array() });
    }
        try {
            const { userId, userName, email, password,roleId } = req.body;

            // Check if the user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user: IUser = new User({ userId, userName, email, password: hashedPassword,roleId });
            await user.save();
            res.status(201).json(user);
        } catch (error:any) {
            res.status(400).json({ error: error.message });
        }
    }

     // Validation for login inputs
     loginValidation = [
        body('email').isEmail().withMessage('Invalid email format'),
        body('password').notEmpty().withMessage('Password is required')
    ];

    // Login method
    async login(req: Request, res: Response): Promise<any> {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
    
            // Include roleId in the token payload
            const token = jwt.sign(
                { userId: user.userId, roleId: user.roleId },
                process.env.JWT_SECRET || 'your_jwt_secret',
                { expiresIn: '1h' }
            );
            res.json({ token });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
    

    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (error:any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getOneUser(req: Request, res: Response) {
        const { userId } = req.params;
        try {
            const user = await User.findOne({userId});
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error:any) {
            res.status(500).json({ error: error.message });
        }
    }
    async updateUser(req: Request, res: Response) {
        const { userId } = req.params; // Get userId from route parameters
        const updates = req.body; // Get the updates from the request body

        try {
            const user = await User.findOneAndUpdate({ userId }, updates, { new: true });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteUser(req: Request, res: Response)
    {
        const { userId } = req.params;
        try {
            const user = await User.findOneAndDelete({ userId });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(204).send(); // No content to send back
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
    }


export default new UserController();
