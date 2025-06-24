import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../../data/images.db');

// Create database directory if it doesn't exist
import fs from 'fs';
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        initializeTables();
    }
});

const initializeTables = () => {
    // Images table - stores original image metadata
    db.run(`
        CREATE TABLE IF NOT EXISTS images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT UNIQUE NOT NULL,
            original_path TEXT NOT NULL,
            format TEXT NOT NULL,
            width INTEGER NOT NULL,
            height INTEGER NOT NULL,
            size INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Processed images table - stores processed image metadata
    db.run(`
        CREATE TABLE IF NOT EXISTS processed_images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            original_image_id INTEGER NOT NULL,
            processed_path TEXT NOT NULL,
            width INTEGER NOT NULL,
            height INTEGER NOT NULL,
            quality INTEGER DEFAULT 80,
            blur REAL DEFAULT 0,
            sharpen BOOLEAN DEFAULT 0,
            grayscale BOOLEAN DEFAULT 0,
            rotate INTEGER DEFAULT 0,
            flip BOOLEAN DEFAULT 0,
            flop BOOLEAN DEFAULT 0,
            tint TEXT,
            processing_time_ms INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (original_image_id) REFERENCES images (id)
        )
    `);

    // API logs table - stores API request logs
    db.run(`
        CREATE TABLE IF NOT EXISTS api_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            endpoint TEXT NOT NULL,
            method TEXT NOT NULL,
            filename TEXT,
            parameters TEXT,
            status_code INTEGER NOT NULL,
            response_time_ms INTEGER,
            ip_address TEXT,
            user_agent TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Image statistics table - stores usage statistics
    db.run(`
        CREATE TABLE IF NOT EXISTS image_stats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image_id INTEGER NOT NULL,
            access_count INTEGER DEFAULT 0,
            last_accessed DATETIME,
            total_processing_time_ms INTEGER DEFAULT 0,
            average_processing_time_ms REAL DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (image_id) REFERENCES images (id)
        )
    `);

    console.log('Database tables initialized');
};

export const closeDatabase = () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed');
        }
    });
}; 