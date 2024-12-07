import * as express from 'express';
import { json, urlencoded } from 'express';
import cors from 'cors';
import imageRoutes from './routes/imageRoutes';

const port = 3000;
const app = express.default();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));

// Define routes
app.use('/images', imageRoutes);
console.log('util.routes')
// Home route
app.get('/', (req, res) => {
  res.json({
    message: "Welcome to Image Processing API",
    endpoints: {
      list: "GET /images",
      get: "GET /images/:id",
      create: "POST /images",
      update: "PUT /images/:id",
      delete: "DELETE /images/:id",
      resize: "GET /images/resize?filename=example.jpg&size=small"
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
