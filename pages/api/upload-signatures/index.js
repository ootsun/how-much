import initApiRoute from '../../../lib/utils/restApiHelper.js';
import * as cloudinary from 'cloudinary';

const APY_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;

async function generateSignature(req) {
  const {fileName} = req.body;
  const timestamp = Math.round((new Date).getTime() / 1000);

  const signature = cloudinary.v2.utils.api_sign_request({
    timestamp: timestamp,
    folder: 'projectsLogo',
    public_id: fileName
  }, CLOUDINARY_API_SECRET);

  return {
    timestamp,
    signature,
    apiKey: APY_KEY,
    cloudName: CLOUD_NAME
  };
}

export default initApiRoute(null, {handle: generateSignature, checkAuth: true}, null, null);
