const pgp = require('pg_promise')();

const cn = {
  host: process.env.HOST,
  port: process.env.PGPORT,
  database: process.env.DB,
  user: process.env.USER,
}

const db = pgp(cn);
