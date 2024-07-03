const mysql = require('mysql2/promise');

// .env로 민감한 정보 관리
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
  connectionLimit: 1000,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PSWORD,
  port : process.env.DB_PORT | 3306,
  multipleStatements : true
});

module.exports = pool;