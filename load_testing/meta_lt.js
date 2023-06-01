/* eslint-disable */
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '3s', target: 500 },
    { duration: '30s', target: 1100 },
    { duration: '3s', target: 500 },
  ],
};

export default () => {
  const productId = Math.floor(900000 + Math.random() * 100000);
  const res = http.get(http.url`http://localhost:3001/reviews/meta?product_id=${productId}`); // should be api reviews; need to update in frontend router
  check(res, {
    'is Status 200': (r) => r.status == 200,
  });
  sleep(1);
}