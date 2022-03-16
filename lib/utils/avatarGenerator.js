import axios from 'axios';

const AVATAR_GENERATION_SERVICE_URL = process.env.AVATAR_GENERATION_SERVICE_URL;

export const generateAvatar = async (address) => {
  const res = await axios.get(AVATAR_GENERATION_SERVICE_URL.replace('ETH_ADDRESS', address));
  return await res.data;
}
