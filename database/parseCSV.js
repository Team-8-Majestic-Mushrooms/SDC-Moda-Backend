const fs = require('fs');
const { Pool } = require('pg');
const csv = require('fast-csv');

const stream = fs.createReadStream('../SDC_Data/product.csv');
const csvData = [];
const csvStream = csv
  .parse()
  .on('data', (data) => {
    csvData.push(data);
  })
  .on('end', () => {
    csvData.shift();

    const pool = new Pool({
      host: 'localhost',
      user: 'ASL',
      database: 'testdb',
      port: 5432,
      idleTimeoutMillis: 0,
      connectionTimeoutMillis: 0,
    });

    const query = 'INSERT INTO products (id, name, slogan, description, category, default_price) VALUES ($1, $2, $3, $4, $5, $6)';

    pool.connect((err, client, done) => {
      if (err) throw err;

      try {
        csvData.forEach((row) => {
          client.query(query, row, (err, res) => {
            if (err) {
              console.log(err.stack);
            } else {
              console.log(`inserted ${res.rowCount} row: ${row}`);
            }
          });
        });
      } finally {
        done();
      }
    });
  });

stream.pipe(csvStream);
