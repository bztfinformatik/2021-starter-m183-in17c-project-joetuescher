const mysql = require("mysql2");
const logger = require("./log");


const connectionPool = mysql.createPool({
  host: process.env.NODE_DBHOST,
  user: process.env.NODE_DBUSER,
  database: process.env.NODE_DBSCHEMA,
  password: process.env.NODE_DBPWD,
});

async function execute(sql, values, connection) {
  if (logger.levels[process.env.NODE_LOGLEVEL] >= logger.levels.verbose) {
    const formatedSql = connection.format(sql, values);
    logger.debug("Executing SQL", {
      sql: formatedSql,
    });
    const result = await connection.execute(formatedSql);
    logger.debug("Result of SQL query", {result: JSON.stringify(result[0])});
    return result;
  } else {
    return await connection.execute(sql, values);
  }
}

async function get(stmt) {
  const connection = connectionPool.promise();
  let result = new Array(0);

  try {
    await connection.query(`start transaction`);
    result = await execute(stmt.sql, stmt.values, connection);
    await connection.query(`commit`);
    return result;
  } catch (err) {
    await connection.query(`rollback`);
    throw err;
  }
}

async function set(stmts) {
  const connection = connectionPool.promise();
  let affectedRows = 0;

  try {
    await connection.query(`start transaction`);
    for (const stmt of stmts) {
      const result = await execute(stmt.sql, stmt.values, connection);
      affectedRows = affectedRows + result[0].affectedRows;
    }
    await connection.query(`commit`);
    return affectedRows;
  } catch (err) {
    await connection.query(`rollback`);
    throw err;
  }
}

module.exports.get = get;
module.exports.set = set;
