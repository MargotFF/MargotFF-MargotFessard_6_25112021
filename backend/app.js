const express = require('express');
const helmet = require("helmet");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');

require('dotenv').config({ path: './.env'});

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST_NAME}.upyvu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection successful !'))
  .catch(() => console.log('MongoDB connection failed !'));

app.use(helmet());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(mongoSanitize());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
