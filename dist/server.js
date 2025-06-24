"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const imageRoutes_1 = __importDefault(require("./routes/imageRoutes"));
const errorMiddleware_1 = __importDefault(require("./middlewares/errorMiddleware"));
const loggingMiddleware_1 = require("./middlewares/loggingMiddleware");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
require("./database/database"); // Initialize database
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.use(loggingMiddleware_1.loggingMiddleware);
// Serve static files from the images directory
app.use('/images', express_1.default.static(path_1.default.join(__dirname, '../images')));
// Routes
app.use('/api/images', imageRoutes_1.default);
// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Image Processing API' });
});
// 404 handler - must be before error middleware
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource was not found',
        path: req.path
    });
});
// Error middleware should be last
app.use(errorMiddleware_1.default);
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
exports.default = app;
