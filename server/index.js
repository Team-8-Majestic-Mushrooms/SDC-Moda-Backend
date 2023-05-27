require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const controllers = require('./controllers');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.get('/reviews', controllers.getReviews);

app.get('/reviews/meta', (req, res) => {
  console.log('Query params:', req.query);
  res.status(200).send(`request received with query params ${req.query}`);
});

app.listen(3000, () => {
  console.log(`LISTENING ON PORT ${process.env.PORT}`);
});
