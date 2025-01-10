import { Request, Response, NextFunction } from 'express';
import { processImage } from '../utils/imageProccessor';
import path from 'path';
import fs from 'fs';
import { SUPPORTED_FORMATS, fullImagesPath } from '../models';

// Helper function to get image stats
const getImageStats = (filePath: string) => {
    const stats = fs.statSync(filePath);
    return {
        size: stats.size,
        created: stats.birthtime,
        lastModified: stats.mtime
    };
};

export const resizeImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

        const parsedWidth = parseInt(width as string);
        const parsedHeight = parseInt(height as string);
        
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

        const processedImagePath = await processImage(filename as string, { width: parsedWidth, height: parsedHeight });
        const imageStats = getImageStats(processedImagePath);
        
        const response = {
            status: 'success',
            timestamp: new Date().toISOString(),
            processingTime: `${Date.now() - startTime}ms`,
            image: {
                filename: filename,
                originalPath: path.join(fullImagesPath, filename as string),
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

    } catch (error) {
        const errorResponse = {
            status: 'error',
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Unknown error',
            details: error
        };
        console.error('Processing error:', errorResponse);
        next(error);
    }
};

export const validateImage = (req: Request, res: Response, next: NextFunction): void => {
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

    const fileExtension = path.extname(filename as string).toLowerCase().substring(1);
    if (!SUPPORTED_FORMATS.includes(fileExtension)) {
        const error = {
            status: 'error',
            timestamp: new Date().toISOString(),
            error: 'Validation failed',
            message: 'Unsupported file format',
            supported: SUPPORTED_FORMATS,
            received: fileExtension
        };
        console.log('Validation error:', error);
        res.status(400).json(error);
        return;
    }

    const filePath = path.join(fullImagesPath, filename as string);
    if (!fs.existsSync(filePath)) {
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

export const serveStaticFiles = (req: Request, res: Response, next: NextFunction): void => {
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

    const filePath = path.join(fullImagesPath, filename as string);
    if (!fs.existsSync(filePath)) {
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
        } else {
            next();
        }
    });
};
