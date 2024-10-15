// import express from 'express';
// import {
//   getImage,
//   createImage,
//   updateImage,
//   deleteImage,
// } from '../controllers/imageController'; 

// const router = express.Router();

// // get a single image
// router.get('/', getImage); 

// // Create (POST) a new image
// router.post('/', createImage); 

// // Update (PUT) an existing image
// router.put('/:id', updateImage); 

// // Delete (DELETE) an image
// router.delete('/:id', deleteImage); 

// export default router;
import express, { Request, Response, NextFunction } from 'express';
import { resizeImage } from '../utils/imageProcessor';
import path from 'path';

const router = express.Router();

interface ImageQuery {
  filename?: string;
  width?: string;
  height?: string;
}

// Middleware for validating query parameters
const validateQueryParams = (req: Request<{}, {}, {}, ImageQuery>, res: Response, next: NextFunction) => {
  const { filename, width, height } = req.query;
  
  if (!filename || !width || !height) {
    // Instead of returning the response, send the error and call next to stop further middleware
    res.status(400).send('Missing query parameters');
    return; // Ensure the function exits after sending the response
  }
  
  if (isNaN(parseInt(width as string)) || isNaN(parseInt(height as string))) {
    res.status(400).send('Width and height must be numbers');
    return;
  }

  next(); // If everything is fine, call next() to proceed to the route handler
};

// Route with middleware for query validation
router.get('/', validateQueryParams, async (req: Request<{}, {}, {}, ImageQuery>, res: Response) => {
  const { filename, width, height } = req.query;

  try {
    const processedImage = await resizeImage(
      filename as string, 
      parseInt(width as string), 
      parseInt(height as string)
    );
    
    const imagePath = path.resolve(processedImage);
    
    // Send the processed image file as the response
    res.status(200).sendFile(imagePath);
  } catch (error) {
    console.error(error);
    // Send an error response if processing fails
    res.status(500).send('Error processing image');
  }
});

export default router;
