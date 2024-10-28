import { Request, Response } from 'express';
import User, { IUser } from './user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class UserController {
    async register(req: Request, res: Response) {
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

    async login(req: Request, res: Response) {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
            res.json({ token });
        } catch (error:any) {
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
