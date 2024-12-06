// controllers/imageController.ts
import { Request, Response } from 'express';
import { resizeImage } from '../utils/imageProcessor';
import path from 'path';
import { standardSizes, SizeOption } from '../models/imageModel';

// Define the types for the query parameters
interface ImageQuery {
  filename?: string;
  size?: string;
  custom?: string; // Optional custom dimensions in format "widthxheight"
}

// Get image with standard size
export const getImage = async (req: Request<{}, {}, {}, ImageQuery>, res: Response): Promise<void> => {
  const { filename, size, custom } = req.query;

  if (!filename) {
    res.status(400).json({ error: 'Missing filename parameter' });
    return;
  }

  try {
    let width: number;
    let height: number;

    if (custom) {
      // Parse custom dimensions (format: "widthxheight")
      const [customWidth, customHeight] = custom.split('x').map(Number);
      if (isNaN(customWidth) || isNaN(customHeight) || customWidth <= 0 || customHeight <= 0) {
        res.status(400).json({ error: 'Invalid custom dimensions. Format should be "widthxheight" (e.g., 800x600)' });
        return;
      }
      width = customWidth;
      height = customHeight;
    } else if (size) {
      // Use standard size
      const sizeOption = size.toLowerCase() as SizeOption;
      if (!standardSizes[sizeOption]) {
        res.status(400).json({ 
          error: 'Invalid size option',
          validSizes: Object.keys(standardSizes)
        });
        return;
      }
      width = standardSizes[sizeOption].width;
      height = standardSizes[sizeOption].height;
    } else {
      res.status(400).json({ 
        error: 'Missing size parameter',
        message: 'Use either "size" with standard options (thumbnail, small, medium, large) or "custom" with dimensions (e.g., custom=800x600)'
      });
      return;
    }

    const processedImage = await resizeImage(filename, width, height);
    res.sendFile(path.resolve(processedImage));
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Input file not found')) {
        res.status(404).json({ 
          error: `Image '${filename}' not found in uploads directory`,
          message: 'Please place the image in the uploads folder first'
        });
        return;
      }
      res.status(500).json({ error: 'Error processing image', details: error.message });
      return;
    }
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
};

// Get available image sizes
export const getAvailableSizes = (req: Request, res: Response): void => {
  res.json({
    standardSizes,
    usage: {
      standardSize: '/images?filename=example.jpg&size=small',
      customSize: '/images?filename=example.jpg&custom=800x600'
    }
  });
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
