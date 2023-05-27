-- Drop tables if exist
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS characteristics CASCADE;
DROP TABLE IF EXISTS characteristic_reviews;

-- Products
CREATE TABLE products (
  id serial primary key,
  name text,
  slogan text,
  description text,
  category text,
  default_price int
);

\copy products from '../SDC_Data/product.csv' with csv header;

-- Reviews
CREATE TABLE reviews (
  review_id serial primary key,
  product_id int references products(id),
  rating int,
  date bigint,
  summary text,
  body text,
  recommend boolean default false,
  reported boolean default false,
  reviewer_name text,
  reviewer_email text,
  response text,
  helpfulness int default 0
);

\copy reviews from '../SDC_Data/reviews.csv' with csv header;

CREATE INDEX r_idx_product_id ON reviews(product_id);

-- Materialized view for meta counts
CREATE MATERIALIZED VIEW count_rating_agg AS
SELECT product_id,
  JSONB_BUILD_OBJECT(
  '1', COUNT(rating) FILTER (WHERE rating = 1)::text,
  '2', COUNT(rating) FILTER (WHERE rating = 2)::text,
  '3', COUNT(rating) FILTER (WHERE rating = 3)::text,
  '4', COUNT(rating) FILTER (WHERE rating = 4)::text,
  '5', COUNT(rating) FILTER (WHERE rating = 5)::text
  ) AS ratings,
  JSON_BUILD_OBJECT(
    'false', COUNT(recommend) FILTER (WHERE recommend = false)::text,
    'true', COUNT(recommend) FILTER (WHERE recommend = true)::text
  ) AS recommended
FROM reviews
GROUP BY product_id;

CREATE INDEX ct_idx_product_id ON count_rating_agg(product_id);

-- Photos
CREATE TABLE photos(
  id serial primary key,
  review_id int references reviews(review_id),
  url text
);

\copy photos from '../SDC_Data/reviews_photos.csv' with csv header;

CREATE MATERIALIZED VIEW photos_agg AS
  SELECT review_id, jsonb_agg(jsonb_build_object('id', id, 'url', url)) AS photos
  FROM photos GROUP BY review_id;

CREATE INDEX idx_review_id ON photos_agg(review_id);

-- Characteristics
CREATE TABLE characteristics (
  id serial primary key,
  product_id int references products(id),
  name text
);

\copy characteristics from '../SDC_Data/characteristics.csv' with csv header;

-- Characteristic_Reviews
CREATE TABLE characteristic_reviews(
  id serial primary key,
  characteristic_id int references characteristics(id),
  review_id int references reviews(review_id),
  value int
);

\copy characteristic_reviews from '../SDC_Data/characteristic_reviews.csv' with csv header;

CREATE INDEX idx_char_id ON characteristic_reviews(characteristic_id);

--  average rating view
CREATE VIEW avg_rating AS
SELECT
  ROW_NUMBER() OVER (ORDER BY c.product_id) as id,
  c.product_id,
  c.name,
  AVG(cr.value) avg_value
FROM characteristics c JOIN characteristic_reviews cr ON c.id = cr.characteristic_id
GROUP BY c.product_id, c.name;

--- Materialized View for meta Average Ratings
CREATE MATERIALIZED VIEW avg_rating_agg AS
SELECT
  product_id,
  JSONB_OBJECT_AGG(
    name,
    JSONB_BUILD_OBJECT(
    'id', avg_rating.id,
    'value', avg_value::text
  )) characteristics
FROM avg_rating
GROUP BY product_id;

CREATE INDEX avg_idx_product_id ON avg_rating_agg(product_id);

-- /reviews query
-- SELECT * FROM reviews r JOIN photos_agg p ON r.review_id = p.review_id WHERE product_id = 40350;

-- meta query
-- SELECT * FROM count_rating_agg c JOIN avg_rating_agg a ON c.product_id = a.product_id WHERE c.product_id = 40350;