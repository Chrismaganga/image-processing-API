import express from 'express';
import dotenv from 'dotenv';
import imageRoutes from './routes/imageRoutes';
import errorMiddleware from './middlewares/errorMiddleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use('/api/images', imageRoutes);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;

