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

-- Photos
CREATE TABLE photos(
  id serial primary key,
  review_id int references reviews(review_id),
  url text
);

\copy photos from '../SDC_Data/reviews_photos.csv' with csv header;

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
  review_id int references reviews(review_id),
  characteristic_id int,  --references characteristics(id), -- need to address fk issues
  value int
);

\copy characteristic_reviews from '../SDC_Data/characteristic_reviews.csv' with csv header;
