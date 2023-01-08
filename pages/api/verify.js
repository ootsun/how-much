import {ErrorTypes, SiweMessage} from 'siwe';
import initApiRoute from '../../lib/utils/restApiHelper.js';
import Nonce from '../../models/Nonce.js';
import User from '../../models/User.js';
import {sign} from 'jsonwebtoken';
import log from '../../lib/log/logger.js';
import {v2 as cloudinaryV2} from 'cloudinary';
import {generateAvatar} from '../../lib/utils/avatarGenerator.js';
import dbConnect from "../../lib/database/dbConnect.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_VALIDITY_DURATION = process.env.JWT_VALIDITY_DURATION;
const AVATARS_FOLDER_NAME = process.env.CLOUDINARY_AVATARS_FOLDER_NAME;

async function verify(req) {
  const {message, signature} = req.body;
  if(!message || !signature){
    throw new Error('A value is missing');
  }

  const siweMessage = new SiweMessage(message);
  try {
    const fields = await siweMessage.validate(signature);

    await dbConnect();

    const nonce = await Nonce.findOne({address: fields.address});
    if (fields.nonce !== nonce.value) {
      throw new Error('Invalid nonce');
    }

    let user = await User.findOne({address: fields.address});
    if(!user) {
      const image = await generateAvatar(fields.address);
      const base64 = new Buffer(image).toString('base64');
      const upload = await cloudinaryV2.uploader.upload(`data:image/png;base64,${base64}`, {
        public_id: AVATARS_FOLDER_NAME + "/" + fields.address,
      });
      user = await User.create({address: fields.address, avatarUrl: upload.secure_url});
      log.info(`User with address ${user.address} successfully created`);
    }

    const token = sign({user: user}, JWT_SECRET, {expiresIn: JWT_VALIDITY_DURATION}, null);
    log.info(`User with address ${user.address} successfully logged in`);
    return {token: token};
  } catch(error) {
    if(error === ErrorTypes.EXPIRED_MESSAGE || error === ErrorTypes.INVALID_SIGNATURE){
      error.statusCode = 400;
    }
    throw error;
  }
}

export default initApiRoute(null, {handle: verify}, null, null);
