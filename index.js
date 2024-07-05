const express = require('express');
var cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const todoRoute = require('./routes/todo');

dotenv.config();

const app = express();
app.use(cors());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server only after successful connection to the database
    app.listen(8800, () => {
      console.log('Server is running on port 8800');
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

// Routes can be added here
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/todo', todoRoute);
