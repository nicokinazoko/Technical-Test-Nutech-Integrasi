import express from 'express';
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';
import cors from 'cors';

import InformationRoutes from './routes/information.route.js';
import MembershipRoutes from './routes/membership.route.js';
import TransactionRoutes from './routes/transaction.route.js';
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', [InformationRoutes, MembershipRoutes, TransactionRoutes]);

import './db/config.js';

dotenv.config({ path: '.env-dev' });

const port = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send('hello world');
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(port);
