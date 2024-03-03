//Main server file using Express.js to handle requests and responses

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/skilltrade', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(bodyParser.json());

// Import routes
const userRoutes = require('./routes/userRoutes');
const skillRoutes = require('./routes/skillRoutes');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
