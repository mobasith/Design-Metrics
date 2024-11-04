import { Request, Response } from "express";
import Design from "../models/designModel";
import cloudinary from "../config/cloudinaryConfig";

export const createDesign = async (req: Request, res: Response) => {
  const { designId, designTitle, description, createdById, createdByName } =
    req.body;
  const designInput: any = req.file; // File from the request

  try {
    // Upload the image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(designInput.path, {
      folder: "designs",
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
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
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
export const getDesignsByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const designs = await Design.find({ createdById: userId });
    if (designs.length === 0) {
      return res
        .status(404)
        .json({ message: "No designs found for this user." });
    }
    res.status(200).json(designs);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
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
