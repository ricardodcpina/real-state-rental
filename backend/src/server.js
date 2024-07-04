require('dotenv').config();

const mongoose = require('mongoose');
const { app } = require('./app');

const PORT = process.env.PORT || 8000;
const DATABASE_URL = process.env.MONGO_URL;

const main = async () => {
  try {
    await mongoose.connect(DATABASE_URL);

    app.listen(PORT, () => {
      console.log(`Server up an running on port ${PORT}`);
    });
  } catch {
    console.log('Error connecting to database');
    process.exit(0);
  }
};

main();
