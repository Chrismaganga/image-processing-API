import express from 'express';
import { getImage, getAvailableSizes, createImage, updateImage, deleteImage } from '../controllers/imageController';

const router = express.Router();

// Get available image sizes
router.get('/sizes', getAvailableSizes);

// Process image with standard or custom size
router.get('/', getImage);

// Additional routes for future implementation
router.post('/', createImage);
router.put('/:id', updateImage);
router.delete('/:id', deleteImage);

export default router;
