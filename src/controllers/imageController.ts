// controllers/imageController.ts
import { Request, Response } from 'express';
import { resizeImage } from '../utils/imageProcessor'; // Ensure this path is correct

// Define the types for the query parameters
interface ImageQuery {
  filename?: string;
  width?: string;
  height?: string;
}

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
