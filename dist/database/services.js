"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOverallStats = exports.getImageStats = exports.updateImageStats = exports.getApiLogs = exports.logApiRequest = exports.getProcessedImages = exports.saveProcessedImage = exports.getAllImages = exports.getImageByFilename = exports.saveImage = void 0;
const database_1 = require("./database");
// Image operations
const saveImage = (metadata) => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT OR REPLACE INTO images 
            (filename, original_path, format, width, height, size, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `;
        database_1.db.run(sql, [
            metadata.filename,
            metadata.originalPath || '',
            metadata.format,
            metadata.width,
            metadata.height,
            metadata.size
        ], function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve(this.lastID);
            }
        });
    });
};
exports.saveImage = saveImage;
const getImageByFilename = (filename) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM images WHERE filename = ?';
        database_1.db.get(sql, [filename], (err, row) => {
            if (err) {
                reject(err);
            }
            else {
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
exports.getImageByFilename = getImageByFilename;
const getAllImages = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM images ORDER BY created_at DESC';
        database_1.db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
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
exports.getAllImages = getAllImages;
// Processed image operations
const saveProcessedImage = (originalImageId, processedPath, options, processingTime) => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO processed_images 
            (original_image_id, processed_path, width, height, quality, blur, sharpen, 
             grayscale, rotate, flip, flop, tint, processing_time_ms)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        database_1.db.run(sql, [
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
        ], function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve(this.lastID);
            }
        });
    });
};
exports.saveProcessedImage = saveProcessedImage;
const getProcessedImages = (originalImageId) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT * FROM processed_images 
            WHERE original_image_id = ? 
            ORDER BY created_at DESC
        `;
        database_1.db.all(sql, [originalImageId], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        });
    });
};
exports.getProcessedImages = getProcessedImages;
// API logging operations
const logApiRequest = (endpoint, method, filename, parameters, statusCode, responseTime, ipAddress, userAgent) => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO api_logs 
            (endpoint, method, filename, parameters, status_code, response_time_ms, ip_address, user_agent)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        database_1.db.run(sql, [
            endpoint,
            method,
            filename,
            JSON.stringify(parameters),
            statusCode,
            responseTime,
            ipAddress,
            userAgent
        ], function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
};
exports.logApiRequest = logApiRequest;
const getApiLogs = (limit = 100) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT * FROM api_logs 
            ORDER BY created_at DESC 
            LIMIT ?
        `;
        database_1.db.all(sql, [limit], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        });
    });
};
exports.getApiLogs = getApiLogs;
// Statistics operations
const updateImageStats = (imageId, processingTime) => {
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
        database_1.db.run(sql, [
            imageId, imageId, processingTime, imageId, processingTime,
            processingTime, imageId, processingTime
        ], function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
};
exports.updateImageStats = updateImageStats;
const getImageStats = (imageId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM image_stats WHERE image_id = ?';
        database_1.db.get(sql, [imageId], (err, row) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(row);
            }
        });
    });
};
exports.getImageStats = getImageStats;
const getOverallStats = () => {
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
        database_1.db.get(sql, [], (err, row) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(row);
            }
        });
    });
};
exports.getOverallStats = getOverallStats;
