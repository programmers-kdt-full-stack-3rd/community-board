import mariaDB from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT ? parseInt(process.env.PORT) : 3306;

const pool = mariaDB.createPool({
  connectionLimit: 1000,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PSWORD,
  port : port,
  multipleStatements : true
});

export default pool;