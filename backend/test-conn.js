require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to local MongoDB OK');
    await mongoose.disconnect();
  } catch (e) {
    console.error('Connection error', e.message);
  }
}
run();
