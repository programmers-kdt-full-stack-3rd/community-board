import mariaDB from "mysql2/promise";

import config from "../config";

const pool = mariaDB.createPool(config.db);

export default pool;
