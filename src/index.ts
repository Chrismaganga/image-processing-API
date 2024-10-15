import serverless from 'serverless-http';
import imageRoutes from './routes/imageRoutes';
import express, { json, urlencoded } from 'express';

const port = 5000;
const app = express();

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

// Start server in development mode
if (process.env.NODE_ENV === 'development') {
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

// Export serverless handler for AWS Lambda
export default {
  handler: serverless(app),
};
