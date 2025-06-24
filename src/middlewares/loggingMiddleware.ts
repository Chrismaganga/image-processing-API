import { Request, Response, NextFunction } from 'express';
import { logApiRequest } from '../database/services';

export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    const originalSend = res.send;
    
    // Override res.send to capture response data
    res.send = function(data) {
        const responseTime = Date.now() - startTime;
        
        // Log the API request asynchronously (don't block the response)
        logApiRequest(
            req.path,
            req.method,
            req.query.filename as string || null,
            req.query,
            res.statusCode,
            responseTime,
            req.ip || 'unknown',
            req.get('User-Agent') || 'unknown'
        ).catch(err => {
            console.error('Error logging API request:', err);
        });
        
        // Call the original send method
        return originalSend.call(this, data);
    };
    
    next();
}; 