import { Request, Response } from 'express';
import Design from '../models/designModel';

export const createDesign = async (req: Request, res: Response) => {
  const { designId, designTitle, description, createdBy, designInput } = req.body;

  try {
    const newDesign = new Design({ designId, designInput, designTitle, description, createdBy });
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

// i want to create endpoijnt for update

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
