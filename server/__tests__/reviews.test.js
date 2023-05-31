const request = require('supertest');
const express = require('express');
const morgan = require('morgan');
const controllers = require('../controllers');
const db = require('../../database/db');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.get('/reviews', controllers.getReviews);
app.post('/reviews', controllers.postReview);

describe('Reviews Routes', () => {
  beforeEach(() => db.none('CREATE TEMPORARY TABLE reviews (LIKE reviews INCLUDING ALL)')
    .then((result) => console.log('CREATE RESULT', result))
    .then(db.none(
      'INSERT INTO pg_temp.reviews (product_id, rating, summary, body, recommend, reviewer_name, reviewer_email) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [40344, 4, 'Test Review 1', 'This is a test review', true, 'lundo', 'lundo@lundo.dev'],
    )));

  afterEach(() => db.none('DROP TABLE IF EXISTS pg_temp.reviews'));

  describe('GET /reviews', () => {
    it('should respond with a list of reviews', (done) => request(app)
      .get('/reviews')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.product_id).toBe(40344);
        done();
      })
      .catch((err) => done(err)));
  });
});
