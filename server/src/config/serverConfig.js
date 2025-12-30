require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const removeHttpHeader = require('../middleware/removeHttpHeader');

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, `../logs/access_${new Date().toLocaleDateString()}.log`),
  { flags: 'a' },
);

const corsOptions = {
  origin: [process.env.CLIENT_URL],
  credentials: true,
};

const serverConfig = (app) => {
  app.use(cors(corsOptions));

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(express.static(path.join(__dirname, '../public')));

  app.use(morgan('combined', { stream: accessLogStream }));

  app.use(removeHttpHeader);

  app.use(cookieParser());
};

module.exports = serverConfig;
