const db_host = process.env.DB_HOST;
const db_pw = process.env.DB_PW || process.env.DB_PASSWORD || '';
const db_user = process.env.DB_USER;
const db_name = process.env.DB_NAME;
const db_port = process.env.DB_PORT || 3306;

module.exports = {
  HOST: db_host,
  USER: db_user,
  PASSWORD: db_pw,
  DB: db_name,
  PORT: db_port,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};