import express from 'express';
import dotenv from 'dotenv';

import './db/config.js';

dotenv.config({ path: '.env-dev' });

const port = process.env.PORT || 4000;

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('hello world');
});

app.listen(port);
