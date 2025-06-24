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
exports.serveStaticFiles = exports.validateImage = exports.resizeImage = void 0;
const imageProccessor_1 = require("../utils/imageProccessor");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const models_1 = require("../models");
// Helper function to get image stats
const getImageStats = (filePath) => {
    const stats = fs_1.default.statSync(filePath);
    return {
        size: stats.size,
        created: stats.birthtime,
        lastModified: stats.mtime
    };
};
const resizeImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filename, width, height } = req.query;
        const startTime = Date.now();
        if (!filename || !width || !height) {
            const error = {
                status: 'error',
                timestamp: new Date().toISOString(),
                error: 'Missing parameters',
                required: {
                    filename: 'string',
                    width: 'number',
                    height: 'number'
                },
                received: { filename, width, height }
            };
            console.log('Error:', error);
            res.status(400).json(error);
            return;
        }
        const parsedWidth = parseInt(width);
        const parsedHeight = parseInt(height);
        if (isNaN(parsedWidth) || isNaN(parsedHeight)) {
            const error = {
                status: 'error',
                timestamp: new Date().toISOString(),
                error: 'Invalid dimensions',
                message: 'Width and height must be valid numbers',
                received: { width, height }
            };
            console.log('Error:', error);
            res.status(400).json(error);
            return;
        }
        const processedImagePath = yield (0, imageProccessor_1.processImage)(filename, { width: parsedWidth, height: parsedHeight });
        const imageStats = getImageStats(processedImagePath);
        const response = {
            status: 'success',
            timestamp: new Date().toISOString(),
            processingTime: `${Date.now() - startTime}ms`,
            image: {
                filename: filename,
                originalPath: path_1.default.join(models_1.fullImagesPath, filename),
                processedPath: processedImagePath,
                dimensions: {
                    width: parsedWidth,
                    height: parsedHeight
                },
                stats: imageStats,
                urls: {
                    original: `/api/images/static?filename=${filename}`,
                    processed: `/api/images/resize?filename=${filename}&width=${width}&height=${height}`
                }
            }
        };
        console.log('Image processed:', response);
        res.status(200).json(response);
    }
    catch (error) {
        const errorResponse = {
            status: 'error',
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Unknown error',
            details: error
        };
        console.error('Processing error:', errorResponse);
        next(error);
    }
});
exports.resizeImage = resizeImage;
const validateImage = (req, res, next) => {
    const { filename } = req.query;
    if (!filename) {
        const error = {
            status: 'error',
            timestamp: new Date().toISOString(),
            error: 'Validation failed',
            message: 'Filename is required'
        };
        console.log('Validation error:', error);
        res.status(400).json(error);
        return;
    }
    const fileExtension = path_1.default.extname(filename).toLowerCase().substring(1);
    if (!models_1.SUPPORTED_FORMATS.includes(fileExtension)) {
        const error = {
            status: 'error',
            timestamp: new Date().toISOString(),
            error: 'Validation failed',
            message: 'Unsupported file format',
            supported: models_1.SUPPORTED_FORMATS,
            received: fileExtension
        };
        console.log('Validation error:', error);
        res.status(400).json(error);
        return;
    }
    const filePath = path_1.default.join(models_1.fullImagesPath, filename);
    if (!fs_1.default.existsSync(filePath)) {
        const error = {
            status: 'error',
            timestamp: new Date().toISOString(),
            error: 'Validation failed',
            message: 'File not found',
            path: filePath
        };
        console.log('Validation error:', error);
        res.status(404).json(error);
        return;
    }
    const response = {
        status: 'success',
        timestamp: new Date().toISOString(),
        message: 'Image validation successful',
        image: {
            filename: filename,
            path: filePath,
            format: fileExtension,
            stats: getImageStats(filePath)
        }
    };
    console.log('Validation success:', response);
    next();
};
exports.validateImage = validateImage;
const serveStaticFiles = (req, res, next) => {
    const { filename } = req.query;
    if (!filename) {
        const error = {
            status: 'error',
            timestamp: new Date().toISOString(),
            error: 'Static file error',
            message: 'Filename is required'
        };
        console.log('Static file error:', error);
        res.status(400).json(error);
        return;
    }
    const filePath = path_1.default.join(models_1.fullImagesPath, filename);
    if (!fs_1.default.existsSync(filePath)) {
        const error = {
            status: 'error',
            timestamp: new Date().toISOString(),
            error: 'Static file error',
            message: 'File not found',
            path: filePath
        };
        console.log('Static file error:', error);
        res.status(404).json(error);
        return;
    }
    const stats = getImageStats(filePath);
    console.log('Serving static file:', {
        status: 'success',
        timestamp: new Date().toISOString(),
        file: {
            filename: filename,
            path: filePath,
            stats: stats
        }
    });
    res.sendFile(filePath, (err) => {
        if (err) {
            const error = {
                status: 'error',
                timestamp: new Date().toISOString(),
                error: 'File send error',
                message: err.message,
                details: err
            };
            console.error('Static file send error:', error);
            next(err);
        }
        else {
            next();
        }
    });
};
exports.serveStaticFiles = serveStaticFiles;
