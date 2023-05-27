require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const controllers = require('./controllers');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.get('/reviews', controllers.getReviews);

app.get('/reviews/meta', controllers.getMeta);

app.listen(3000, () => {
  console.log(`LISTENING ON PORT ${process.env.PORT}`);
});
