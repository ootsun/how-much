import axios from 'axios';
import {svg2png} from 'svg-png-converter';

const AVATAR_GENERATION_SERVICE_URL = process.env.AVATAR_GENERATION_SERVICE_URL;

export const generateAvatar = async (address) => {
  const res = await axios.get(AVATAR_GENERATION_SERVICE_URL.replace('ETH_ADDRESS', address));
  const svg = await res.data;
  return await svg2png({
    input: svg,
    encoding: 'dataURL',
    format: 'png',
    width: 40,
    height: 40,
    quality: 1
  });
}
