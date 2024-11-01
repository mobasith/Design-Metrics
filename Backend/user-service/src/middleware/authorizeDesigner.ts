// middleware/authorizeDesigner.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authorizeDesigner = (req: Request, res: Response, next: NextFunction):any => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        
        // Check if the user has a designer role (assuming roleId for designers is 2)
        if (decoded.roleId !== 2) {
            return res.status(403).json({ message: 'Forbidden: Designers only' });
        }

        req.body.userId = decoded.userId; // Optionally pass userId along
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};


