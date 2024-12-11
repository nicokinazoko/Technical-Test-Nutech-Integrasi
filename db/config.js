import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env-dev' });

const url =
  process.env.DB_ENV === 'localhost'
    ? `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`
    : `mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`;

console.log(url);
//add database
mongoose.connect(url);

console.log(process.env.DB_HOST, process.env.DB_NAME);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
  console.log('Connection with database succeeded.');
});

export { db };
