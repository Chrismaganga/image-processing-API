import express from 'express';
import { resizeImage, validateImage, serveStaticFiles } from '../controllers/imageControllers';

const router = express.Router();

// GET /api/images
router.get('/', (req, res) => {
    res.json({
        status: 'success',
        timestamp: new Date().toISOString(),
        message: 'Image Processing API endpoints',
        endpoints: {
            resize: '/api/images/resize?filename=example.jpg&width=300&height=300',
            validate: '/api/images/validate?filename=example.jpg',
            static: '/api/images/static?filename=example.jpg'
        }
    });
});

// Image processing routes
router.get('/resize', validateImage, resizeImage);
router.get('/validate', validateImage);
router.get('/static', serveStaticFiles);

// Handle 404 for any other routes under /api/images
router.use((req, res) => {
    const error = {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Not Found',
        message: 'The requested image endpoint does not exist',
        path: req.baseUrl + req.path,
        availableEndpoints: ['/resize', '/validate', '/static']
    };
    console.log('Route not found:', error);
    res.status(404).json(error);
});

export default router;
