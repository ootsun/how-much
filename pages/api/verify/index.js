import {ErrorTypes, SiweMessage} from 'siwe';
import initApiRoute from '../../../lib/utils/restApiHelper.js';
import Nonce from '../../../models/Nonce.js';
import User from '../../../models/User.js';
import jwt from 'jsonwebtoken';
import log from '../../../lib/log/logger.js';
import Avatar from 'avatar-builder';
import * as cloudinary from 'cloudinary';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_VALIDITY_DURATION = process.env.JWT_VALIDITY_DURATION;

const avatar = Avatar.builder(Avatar.Image.circleMask(Avatar.Image.identicon()), 128, 128, {cache: Avatar.Cache.lru()});

async function verify(req) {
  const {message, signature} = req.body;
  if(!message || !signature){
    throw new Error('A value is missing');
  }

  const siweMessage = new SiweMessage(message);
  try {
    const fields = await siweMessage.validate(signature);

    const nonce = await Nonce.findOne({address: fields.address});
    if (fields.nonce !== nonce.value) {
      throw new Error('Invalid nonce');
    }

    let user = await User.findOne({address: fields.address});
    if(!user) {
      const image = await avatar.create(fields.address);
      const upload = await cloudinary.v2.uploader.upload(`data:image/png;base64,${image.toString('base64')}`, {
        public_id: "avatars/" + fields.address,
      });
      user = await User.create({address: fields.address, avatarUrl: upload.secure_url});
      log.info(`User with address ${user.address} successfully created`);
    }

    const token = jwt.sign({user: user}, JWT_SECRET, {expiresIn: JWT_VALIDITY_DURATION}, null);
    log.info(`User with address ${user.address} successfully logged in`);
    return {token: token};
  } catch(error) {
    if(error === ErrorTypes.EXPIRED_MESSAGE || error === ErrorTypes.INVALID_SIGNATURE){
      error.statusCode = 400;
    }
    throw error;
  }
}

export default initApiRoute(null, verify, null, null, false);
