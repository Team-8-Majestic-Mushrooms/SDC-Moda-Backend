const { queryReviews, queryMeta, insertReview } = require('../models');

module.exports = {
  getReviews: (req, res) => {
    const {
      page, count, sort, product_id,
    } = req.query;
    queryReviews(product_id, page, count, sort)
      .then((results) => {
        const resObj = {
          product: product_id,
          page: (page - 1) * count || 0,
          count: Number(count) || 5,
          results,
        };
        res.status(200).json(resObj);
      })
      .catch((err) => {
        console.log('getReviews Error', err);
        res.sendStatus(500);
      });
  },
  getMeta: (req, res) => {
    const { product_id } = req.query;
    queryMeta(product_id)
      .then((results) => res.status(200).json(results))
      .catch((err) => {
        console.log('getMeta Error:', err);
        res.sendStatus(500);
      });
  },
  postReview: (req, res) => {
    insertReview(req.body)
      .then((results) => res.status(201).send(results))
      .catch((err) => {
        console.log('postReview Error:', err);
        res.sendStatus(500);
      });
  },
};

// newReview obj = {
//         product_id: product.id,
//         rating,
//         summary,
//         body,
//         recommend,
//         name,
//         email,
//         photos,
//         characteristics: charRatings,
//       }
