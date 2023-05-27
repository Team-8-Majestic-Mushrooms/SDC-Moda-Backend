const { queryReviews } = require('../models');

module.exports = {
  getReviews: (req, res) => {
    const {
      page, count, sort, product_id,
    } = req.query;
    queryReviews(product_id, page, count, sort)
      .then((results) => {
        const resObj = {
          product: product_id,
          page: page - 1,
          count,
          results,
        };
        res.status(200).json(resObj);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  },
};
