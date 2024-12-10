import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env-dev' });

//add database
mongoose.connect(
  'mongodb://' + process.env.DB_HOST + '/' + process.env.DB_NAME
);

console.log(process.env.DB_HOST, process.env.DB_NAME);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
  console.log('Connection with database succeeded.');
});

export { db };
