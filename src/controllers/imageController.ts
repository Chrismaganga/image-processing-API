// controllers/imageController.ts
import { Request, Response } from 'express';
import { resizeImage } from '../utils/imageProcessor';
import path from 'path';
import fs from 'fs';
import { standardSizes, SizeOption } from '../models/imageModel';
import multer from 'multer';

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.resolve('uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
  }
});

// List all images
export const listImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const uploadsDir = path.resolve('uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const files = fs.readdirSync(uploadsDir);
    const images = files.filter(file => 
      /\.(jpg|jpeg|png|gif)$/i.test(file)
    ).map(file => ({
      filename: file,
      url: `/images/${file}`,
      uploadDate: fs.statSync(path.join(uploadsDir, file)).mtime
    }));

    res.json(images);
  } catch (error) {
    res.status(500).json({ error: 'Failed to list images' });
  }
};

// Get a single image
export const getImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const filename = req.params.id;
    const imagePath = path.join(path.resolve('uploads'), filename);

    if (!fs.existsSync(imagePath)) {
      res.status(404).json({ error: 'Image not found' });
      return;
    }

    res.sendFile(imagePath);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve image' });
  }
};

// Upload a new image
export const createImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No image file uploaded' });
      return;
    }

    res.status(201).json({
      message: 'Image uploaded successfully',
      filename: req.file.filename,
      url: `/images/${req.file.filename}`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload image' });
  }
};

// Delete an image
export const deleteImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const filename = req.params.id;
    const imagePath = path.join(path.resolve('uploads'), filename);

    if (!fs.existsSync(imagePath)) {
      res.status(404).json({ error: 'Image not found' });
      return;
    }

    fs.unlinkSync(imagePath);
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete image' });
  }
};

// Resize image
export const resizeImageHandler = async (req: Request, res: Response): Promise<void> => {
  const { filename, size, custom } = req.query;

  if (!filename) {
    res.status(400).json({ error: 'Missing filename parameter' });
    return;
  }

  try {
    let width: number;
    let height: number;

    if (custom) {
      const [customWidth, customHeight] = (custom as string).split('x').map(Number);
      if (isNaN(customWidth) || isNaN(customHeight) || customWidth <= 0 || customHeight <= 0) {
        res.status(400).json({ error: 'Invalid custom dimensions. Format should be "widthxheight" (e.g., 800x600)' });
        return;
      }
      width = customWidth;
      height = customHeight;
    } else if (size) {
      const sizeOption = (size as string).toLowerCase() as SizeOption;
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

    const processedImage = await resizeImage(filename as string, width, height);
    res.sendFile(path.resolve(processedImage));
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Input file not found')) {
        res.status(404).json({ 
          error: `Image '${filename}' not found in uploads directory`,
          message: 'Please upload the image first'
        });
        return;
      }
      res.status(500).json({ error: 'Error processing image', details: error.message });
      return;
    }
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
};

export const getAvailableSizes = (req: Request, res: Response): void => {
  res.json({
    standardSizes,
    usage: {
      standardSize: '/images/resize?filename=example.jpg&size=small',
      customSize: '/images/resize?filename=example.jpg&custom=800x600'
    }
  });
};
