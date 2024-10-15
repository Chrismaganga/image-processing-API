// controllers/imageController.ts
import { Request, Response } from 'express';
import { resizeImage } from '../utils/imageProcessor'; // Ensure this path is correct

// Define the types for the query parameters
interface ImageQuery {
  filename?: string;
  width?: string;
  height?: string;
}

// Get image
export const getImage = async (req: Request<{}, {}, {}, ImageQuery>, res: Response): Promise<void> => {
  const { filename, width, height } = req.query;

  // Validate query parameters
  if (!filename || !width || !height) {
    res.status(400).send('Missing query parameters');
    return;
  }

  try {
    // Ensure that the query params are converted to appropriate types
    const processedImage = await resizeImage(
      filename as string,
      parseInt(width as string),
      parseInt(height as string)
    );
    // Send the processed image
    res.status(200).sendFile(processedImage);
  } catch (error) {
    console.error('Error processing image:', error); // Log the error for debugging
    res.status(500).send('Error processing image');
  }
};

// Create a new image (placeholder for implementation)
export const createImage = async (req: Request, res: Response): Promise<void> => {
  // Implementation for creating an image
  // You may want to handle file uploads and save them appropriately
  res.status(201).send('Image created successfully');
};

// Update an existing image (placeholder for implementation)
export const updateImage = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  // Implementation to update image data based on the ID
  // For example, you could update metadata or replace the image
  res.status(200).send(`Image ${id} updated successfully`);
};

// Delete an image (placeholder for implementation)
export const deleteImage = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  // Implementation to delete image based on the ID
  // Make sure to handle the actual deletion logic
  res.status(200).send(`Image ${id} deleted successfully`);
};
