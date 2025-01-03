import express from 'express';
import { resizeImage } from '../controllers/imageControllers';

const router = express.Router();

router.get('/', resizeImage);

export default router;
