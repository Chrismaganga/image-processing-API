// routes/imageRoute.ts
import express from 'express';
import { getImage } from '../controllers/imageController'; 
const router = express.Router();

// Define the image route
router.get('/', getImage);

export default router;
