import * as express from 'express';
import { json, urlencoded } from 'express';
import imageRoutes from './routes/imageRoutes';

const port = 5000;
const app = express.default();

// Middleware for parsing incoming requests
app.use(urlencoded({ extended: false }));
app.use(json());

// Define routes
app.use('/images', imageRoutes);
console.log('util.routes')
// Home route
app.get('/', (req, res) => {
  res.send("Welcome to the Image Processing API");
});

// Start server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

export default app;
