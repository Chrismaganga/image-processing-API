import express from 'express';
import { 
  listImages,
  getImage, 
  createImage, 
  deleteImage,
  resizeImageHandler,
  getAvailableSizes,
  upload
} from '../controllers/imageController';

const router = express.Router();

// Get available sizes
router.get('/sizes', getAvailableSizes);

// Resize image
router.get('/resize', resizeImageHandler);

// CRUD operations
router.get('/', listImages);
router.get('/:id', getImage);
router.post('/', upload.single('image'), createImage);
router.delete('/:id', deleteImage);

export default router;
