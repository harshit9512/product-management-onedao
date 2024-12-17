const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const otpRoutes = require('./routes/otpRoutes');
require('dotenv').config();


const app = express();
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/product', productRoutes);
app.use('/otp', otpRoutes);

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;
