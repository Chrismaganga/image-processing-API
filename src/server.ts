import express from 'express';
import dotenv from 'dotenv';
import imageRoutes from './routes/imageRoutes';  
import errorMiddleware from './middlewares/errorMiddleware';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Serve static files from the images directory
app.use('/images', express.static(path.join(__dirname, '../images')));

// Routes
app.use('/api/images', imageRoutes);

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
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
