import express from 'express';
import { resizeImage, validateImage, serveStaticFiles } from '../controllers/imageControllers';
import { getAllImages, getApiLogs } from '../database/services';

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
            static: '/api/images/static?filename=example.jpg',
            list: '/api/images/list',
            logs: '/api/images/logs'
        }
    });
});

// Image processing routes
router.get('/resize', validateImage, resizeImage);
router.get('/validate', validateImage);
router.get('/static', serveStaticFiles);

// Database routes
router.get('/list', async (req, res) => {
    try {
        const images = await getAllImages();
        res.json({
            status: 'success',
            timestamp: new Date().toISOString(),
            count: images.length,
            images: images
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

router.get('/logs', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit as string) || 100;
        const logs = await getApiLogs(limit);
        res.json({
            status: 'success',
            timestamp: new Date().toISOString(),
            count: logs.length,
            logs: logs
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Handle 404 for any other routes under /api/images
router.use((req, res) => {
    const error = {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Not Found',
        message: 'The requested image endpoint does not exist',
        path: req.baseUrl + req.path,
        availableEndpoints: ['/resize', '/validate', '/static', '/list', '/logs']
    };
    console.log('Route not found:', error);
    res.status(404).json(error);
});

export default router;
