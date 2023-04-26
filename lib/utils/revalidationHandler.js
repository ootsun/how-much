import axios from 'axios';
import http from 'http';

const SECRET = process.env.REVALIDATION_SECRET_TOKEN;
const HOST = process.env.VERCEL_URL || 'http://localhost:3000';

const instance = axios.create({
  httpAgent: new http.Agent({ family: 4 }),
});


export const revalidate = (path = '') => {
  return instance.get(`${HOST}/api/revalidate?secret=${SECRET}&path=${path}`);
}
