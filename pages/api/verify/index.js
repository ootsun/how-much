import {ErrorTypes, SiweMessage} from 'siwe';
import initApiRoute from '../../../lib/utils/restApiHelper.js';
import Nonce from '../../../models/Nonce.js';
import User from '../../../models/User.js';
import jwt from 'jsonwebtoken';
import log from '../../../lib/log/logger.js';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_VALIDITY_DURATION = process.env.JWT_VALIDITY_DURATION;

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
      user = await User.create({address: fields.address});
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
