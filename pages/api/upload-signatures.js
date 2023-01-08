import initApiRoute from '../../lib/utils/restApiHelper.js';
import {v2 as cloudinaryV2} from 'cloudinary';

const APY_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const PROJECTS_FOLDER_NAME = process.env.CLOUDINARY_PROJECTS_FOLDER_NAME;

async function generateSignature(req) {
  const {public_id} = req.body;
  const timestamp = Math.round((new Date).getTime() / 1000);

  const signature = cloudinaryV2.utils.api_sign_request({
    timestamp,
    folder: PROJECTS_FOLDER_NAME,
    public_id
  }, CLOUDINARY_API_SECRET);

  return {
    timestamp,
    signature,
    apiKey: APY_KEY,
    cloudName: CLOUD_NAME
  };
}

export default initApiRoute(null, {handle: generateSignature, checkAuth: true}, null, null);
