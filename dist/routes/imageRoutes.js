"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const imageControllers_1 = require("../controllers/imageControllers");
const services_1 = require("../database/services");
const router = express_1.default.Router();
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
router.get('/resize', imageControllers_1.validateImage, imageControllers_1.resizeImage);
router.get('/validate', imageControllers_1.validateImage);
router.get('/static', imageControllers_1.serveStaticFiles);
// Database routes
router.get('/list', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const images = yield (0, services_1.getAllImages)();
        res.json({
            status: 'success',
            timestamp: new Date().toISOString(),
            count: images.length,
            images: images
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}));
router.get('/logs', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limit = parseInt(req.query.limit) || 100;
        const logs = yield (0, services_1.getApiLogs)(limit);
        res.json({
            status: 'success',
            timestamp: new Date().toISOString(),
            count: logs.length,
            logs: logs
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}));
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
exports.default = router;
