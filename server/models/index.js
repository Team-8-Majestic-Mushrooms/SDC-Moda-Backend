const db = require('../../database/db');

module.exports = {
  queryReviews: (productId, page = 1, count = 5, sort = 'relevant') => {
    const orderBy = {
      relevant: 'rating',
      newest: 'date',
      helpful: 'helpfulness',
    };

    const q = 'SELECT r.review_id, r.rating, r.summary, r.recommend, r.response, r.body, r.date, r.reviewer_name, r.helpfulness, p.photos FROM reviews r JOIN dynamic_photo_agg(r.review_id) p ON r.review_id = p.review_id WHERE product_id = $4 ORDER BY $3^ DESC LIMIT $2 OFFSET $1';

    return db.any(q, [(page - 1) * count, count, orderBy[sort], productId]);
  },
  queryMeta: (productId) => {
    const q = 'SELECT c.product_id::text, c.ratings, c.recommended, a.characteristics FROM dynamic_count_rating($1) c JOIN dynamic_avg_rating_agg($1) a USING (product_id)';

    return db.one(q, [productId]);
  },

  insertReview: (review) => {
    const reviewInsertQ = 'INSERT INTO reviews (product_id, rating, summary, body, recommend, reviewer_name, reviewer_email) VALUES ($1, $2, $3, $4, $5, $6, $7)';
    const reviewIdQ = 'SELECT MAX(review_id) FROM reviews';
    const photosInsertQ = 'INSERT INTO photos (review_id, url) VALUES ($1, $2)';
    const charReviewInsertQ = 'INSERT INTO characteristic_reviews (characteristic_id, review_id, value) VALUES (135219, 5774953, 1), (135220, 5774953, 1), (135221, 5774953, 1), (135222, 5774953, 1)'; // look at pgpromise docs for best way to handle multiline insert
  }
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
