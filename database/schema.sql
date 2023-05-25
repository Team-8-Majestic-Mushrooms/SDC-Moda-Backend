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

-- Reviews
CREATE TABLE reviews (
  review_id serial primary key,
  product_id int references products(id),
  rating int,
  date date,
  summary text,
  body text,
  recommend int default 0,
  reported int default 0,
  reviewer_name text,
  reviewer_email text,
  response text,
  helpfulness int default 0
);

-- Photos
CREATE TABLE photos(
  id serial primary key,
  review_id int references reviews(review_id),
  url text
);

-- Characteristics
CREATE TABLE characteristics (
  id serial primary key,
  product_id int references products(id),
  name text
);

-- Characteristic_Reviews
CREATE TABLE characteristic_reviews(
  id serial primary key,
  review_id int references reviews(review_id),
  characteristic_id int references characteristics(id),
  value int
);
