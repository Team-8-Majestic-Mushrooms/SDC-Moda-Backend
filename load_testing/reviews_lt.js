/* eslint-disable */
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '3s', target: 1000 },
    { duration: '30', target: 1000 },
    { duration: '3s', target: 0 },
  ],
};

export default () => {
  const productId = Math.floor(Math.random() * 1000000)
  const res = http.get(http.url`http://localhost:3001/reviews?product_id=${productId}`); // should be api reviews; need to update in frontend router
  check(res, {
    'is Status 200': (r) => r.status === 200,
  });
  sleep(1);
}