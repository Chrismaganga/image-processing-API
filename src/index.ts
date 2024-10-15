import serverless from 'serverless-http';
import imageRoutes from './routes/imageRoutes';
import express, { json, urlencoded } from 'express';
const port = 5000;
const app = express();

app.use(urlencoded({ extended: false }));
app.use(json());

app.use('/images', imageRoutes);

app.get('/', (req, res) => {
  res.send("welcome");
});

if (process.env.NODE_ENV === 'dev') {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

export const handler = serverless(app);
