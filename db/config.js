import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env-dev' });

// Construct the correct MongoDB connection URL
const url =
  process.env.SERVER_ENV === 'railway'
    ? `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.MONGOPORT}/${process.env.DB_NAME}?authSource=admin`
    : `mongodb://${process.env.DB_HOST}:${process.env.MONGOPORT}/${process.env.DB_NAME}`;

console.log('MongoDB Connection URL:', url);

mongoose
  .connect(url)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
export { db };
