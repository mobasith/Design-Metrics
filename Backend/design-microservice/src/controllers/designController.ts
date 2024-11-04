import { Request, Response } from 'express';
import Design from '../models/designModel';
import cloudinary from '../config/cloudinaryConfig';

export const createDesign = async (req: Request, res: Response) => {
    const { designId, designTitle, description, createdById, createdByName } = req.body;
    const designInput:any = req.file; // File from the request

    try {
        // Upload the image to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(designInput.path, {
            folder: 'designs', // Optional: specify a folder in Cloudinary
        });

        // Create a new design object with the Cloudinary URL
        const newDesign = new Design({
            designId,
            designInput: uploadResult.secure_url, // Cloudinary image URL
            designTitle,
            description,
            createdById,
            createdByName,
        });
        
        await newDesign.save();
        res.status(201).json(newDesign);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};

export const getDesigns = async (req: Request, res: Response) => {
    try {
        const designs = await Design.find();
        res.status(200).json(designs);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};

//get design by id 

export const getDesignById = async (req: Request, res: Response) => {
    const { id } = req.params; // Change to match the route parameter

    try {
        const design = await Design.findById(id); // Use id instead of designId
        if (!design) {
            return res.status(404).json({ message: 'Design not found.' });
        }
        res.status(200).json(design);
    } catch (error) {
        console.error(error); // Log the error for debugging
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};


// New method to get designs by createdById
export const getDesignsByUserId = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const designs = await Design.find({ createdById: userId }); // Adjust field name if necessary
        if (designs.length === 0) {
            return res.status(404).json({ message: 'No designs found for this user.' });
        }
        res.status(200).json(designs);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};

// Update method remains unchanged
export const updateDesign = async (req: Request, res: Response) => {
    const { designId } = req.params;
    const { designInput, designTitle, description } = req.body;

    try {
        const updatedDesign = await Design.findByIdAndUpdate(designId, { designInput, designTitle, description }, { new: true });
        if (!updatedDesign) {
            return res.status(404).json({ message: 'Design not found' });
        }
        res.status(200).json(updatedDesign);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};
