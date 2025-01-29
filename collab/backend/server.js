const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Add this
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware must come BEFORE routes
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    console.log('Connection string:', process.env.MONGODB_URI);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));

// Basic test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});