import axios from 'axios';

const SECRET = process.env.REVALIDATION_SECRET_TOKEN;
const HOST = process.env.VERCEL_URL || 'http://localhost:3000';

export const revalidate = (path = '') => {
  return axios.get(`${HOST}/api/revalidate?secret=${SECRET}&path=${path}`);
}
