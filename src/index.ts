import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mobileViewRouter from './routes/mobileViewRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Qred Mobile Backend API');
});

app.use('/api/mobile-view', mobileViewRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 