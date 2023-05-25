require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.listen(3000, () => {
  console.log(`LISTENING ON PORT ${process.env.PORT}`);
});
