const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  DB_HOST: process.env.DB_HOST,
  DB_URL: process.env.DB_URL,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  DB_PASS: process.env.DB_PASS,
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  TOKEN_SECRET: process.env.TOKEN_SECRET,
};