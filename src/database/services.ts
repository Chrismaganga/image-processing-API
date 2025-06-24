import { db } from './database';
import { ImageMetadata, ImageProcessingOptions, LogEntry } from '../models';

// Define database row types
interface ImageRow {
    id: number;
    filename: string;
    original_path: string;
    format: string;
    width: number;
    height: number;
    size: number;
    created_at: string;
    updated_at: string;
}

// Image operations
export const saveImage = (metadata: ImageMetadata): Promise<number> => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT OR REPLACE INTO images 
            (filename, original_path, format, width, height, size, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `;
        
        db.run(sql, [
            metadata.filename,
            metadata.originalPath || '',
            metadata.format,
            metadata.width,
            metadata.height,
            metadata.size
        ], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
};

export const getImageByFilename = (filename: string): Promise<ImageMetadata | null> => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM images WHERE filename = ?';
        
        db.get(sql, [filename], (err, row: ImageRow | undefined) => {
            if (err) {
                reject(err);
            } else {
                resolve(row ? {
                    filename: row.filename,
                    format: row.format,
                    width: row.width,
                    height: row.height,
                    size: row.size,
                    created: new Date(row.created_at),
                    lastModified: new Date(row.updated_at),
                    originalPath: row.original_path
                } : null);
            }
        });
    });
};

export const getAllImages = (): Promise<ImageMetadata[]> => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM images ORDER BY created_at DESC';
        
        db.all(sql, [], (err, rows: ImageRow[]) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows.map(row => ({
                    filename: row.filename,
                    format: row.format,
                    width: row.width,
                    height: row.height,
                    size: row.size,
                    created: new Date(row.created_at),
                    lastModified: new Date(row.updated_at),
                    originalPath: row.original_path
                })));
            }
        });
    });
};

// Processed image operations
export const saveProcessedImage = (
    originalImageId: number,
    processedPath: string,
    options: ImageProcessingOptions,
    processingTime: number
): Promise<number> => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO processed_images 
            (original_image_id, processed_path, width, height, quality, blur, sharpen, 
             grayscale, rotate, flip, flop, tint, processing_time_ms)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        db.run(sql, [
            originalImageId,
            processedPath,
            options.width || 0,
            options.height || 0,
            options.quality || 80,
            options.blur || 0,
            options.sharpen ? 1 : 0,
            options.grayscale ? 1 : 0,
            options.rotate || 0,
            options.flip ? 1 : 0,
            options.flop ? 1 : 0,
            options.tint || null,
            processingTime
        ], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
};

export const getProcessedImages = (originalImageId: number): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT * FROM processed_images 
            WHERE original_image_id = ? 
            ORDER BY created_at DESC
        `;
        
        db.all(sql, [originalImageId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

// API logging operations
export const logApiRequest = (
    endpoint: string,
    method: string,
    filename: string | null,
    parameters: any,
    statusCode: number,
    responseTime: number,
    ipAddress: string,
    userAgent: string
): Promise<void> => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO api_logs 
            (endpoint, method, filename, parameters, status_code, response_time_ms, ip_address, user_agent)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        db.run(sql, [
            endpoint,
            method,
            filename,
            JSON.stringify(parameters),
            statusCode,
            responseTime,
            ipAddress,
            userAgent
        ], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

export const getApiLogs = (limit: number = 100): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT * FROM api_logs 
            ORDER BY created_at DESC 
            LIMIT ?
        `;
        
        db.all(sql, [limit], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

// Statistics operations
export const updateImageStats = (imageId: number, processingTime: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT OR REPLACE INTO image_stats 
            (image_id, access_count, last_accessed, total_processing_time_ms, average_processing_time_ms, updated_at)
            VALUES (
                ?, 
                COALESCE((SELECT access_count + 1 FROM image_stats WHERE image_id = ?), 1),
                CURRENT_TIMESTAMP,
                COALESCE((SELECT total_processing_time_ms + ? FROM image_stats WHERE image_id = ?), ?),
                COALESCE((SELECT (total_processing_time_ms + ?) / (access_count + 1) FROM image_stats WHERE image_id = ?), ?),
                CURRENT_TIMESTAMP
            )
        `;
        
        db.run(sql, [
            imageId, imageId, processingTime, imageId, processingTime, 
            processingTime, imageId, processingTime
        ], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

export const getImageStats = (imageId: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM image_stats WHERE image_id = ?';
        
        db.get(sql, [imageId], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

export const getOverallStats = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                COUNT(DISTINCT i.id) as total_images,
                COUNT(DISTINCT pi.id) as total_processed_images,
                COUNT(al.id) as total_api_requests,
                AVG(al.response_time_ms) as avg_response_time,
                SUM(pi.processing_time_ms) as total_processing_time
            FROM images i
            LEFT JOIN processed_images pi ON i.id = pi.original_image_id
            LEFT JOIN api_logs al ON 1=1
        `;
        
        db.get(sql, [], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}; 