import { Request, Response } from 'express';
import Design from '../models/designModel';
import cloudinary from '../config/cloudinaryConfig';
import Comment from '../models/CommentSchema'; // Import Comment model

interface AuthRequest extends Request {
  user?: { userId: string; userName: string };
}


export const createDesign = async (req: AuthRequest, res: Response) => {
  const { designId, designTitle, description } = req.body;
  const designInput: any = req.file;

  try {
    if (!req.user) {
      throw new Error('User information not found in token');
    }

    if (!designInput) {
      throw new Error('No file uploaded');
    }

    if (!designId) {
      throw new Error('Design ID is required');
    }

    const uploadResult = await cloudinary.uploader.upload(designInput.path, {
      folder: 'designs',
    });

    const newDesign = new Design({
      designId: Number(designId),  // Convert to number
      designInput: uploadResult.secure_url,
      designTitle,
      description,
      createdById: req.user.userId,
      createdByName: req.user.userName,
    });

    await newDesign.save();
    res.status(201).json(newDesign);
  } catch (error) {
    console.error('Design creation error:', error);
    res.status(500).json({
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
};

export const getDesigns = async (req: Request, res: Response) => {
  try {
    const designs = await Design.find();
    res.status(200).json(designs);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
};

// Get design by designId
export const getDesignById = async (req: Request, res: Response) => {
  const { designId } = req.params;

  try {
    const design = await Design.findOne({ designId }); // Use findOne and filter by designId
    if (!design) {
      return res.status(404).json({ message: "Design not found." });
    }
    res.status(200).json(design);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
};

// New method to get designs by createdById
// In your designController.ts
// designController.ts
export const getDesignsByUserId = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const designs = await Design.find({ createdById: req.user.userId });
    return res.status(200).json(designs); // Return empty array if no designs found
  } catch (error) {
    console.error('Error in getDesignsByUserId:', error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
};

// Update method remains unchanged
export const updateDesign = async (req: Request, res: Response) => {
  const { designId } = req.params;
  const { designInput, designTitle, description } = req.body;

  try {
    const updatedDesign = await Design.findOneAndUpdate(
      { designId }, // Find by designId instead of _id
      { designInput, designTitle, description },
      { new: true }
    );
    if (!updatedDesign) {
      return res.status(404).json({ message: "Design not found" });
    }
    res.status(200).json(updatedDesign);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
};

//add a comment to a design , based on the design Id
export const addComment = async (req: Request, res: Response) => {
    const { designId } = req.params; // Use the designId from the route parameters
    const { userId, userName, commentText } = req.body;

    // Here, we assume designId is already a number and comes from the URL
    try {
        const newComment = new Comment({
            designId: Number(designId), // Convert to number if needed
            userId,
            userName,
            commentText,
        });

        await newComment.save();
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
};
//get all the comments based on the design Id
export const getDesignComments = async (req: Request, res: Response):Promise<any> => {
    const { designId } = req.params; // Use the designId from the route parameters

    try {
        const comments = await Comment.find({ designId: Number(designId) }); // Query using designId
        if (comments.length === 0) {
            return res.status(404).json({ message: 'No comments found for this design.' });
        }
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
};

