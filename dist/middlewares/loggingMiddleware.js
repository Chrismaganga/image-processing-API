"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggingMiddleware = void 0;
const services_1 = require("../database/services");
const loggingMiddleware = (req, res, next) => {
    const startTime = Date.now();
    const originalSend = res.send;
    // Override res.send to capture response data
    res.send = function (data) {
        const responseTime = Date.now() - startTime;
        // Log the API request asynchronously (don't block the response)
        (0, services_1.logApiRequest)(req.path, req.method, req.query.filename || null, req.query, res.statusCode, responseTime, req.ip || 'unknown', req.get('User-Agent') || 'unknown').catch(err => {
            console.error('Error logging API request:', err);
        });
        // Call the original send method
        return originalSend.call(this, data);
    };
    next();
};
exports.loggingMiddleware = loggingMiddleware;
