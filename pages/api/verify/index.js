import {ErrorTypes, SiweMessage} from 'siwe';
import initApiRoute from '../../../lib/utils/restApiHelper.js';
import Nonce from '../../../models/Nonce.js';

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
    return {success: true};
  } catch(error) {
    if(error === ErrorTypes.EXPIRED_MESSAGE || error === ErrorTypes.INVALID_SIGNATURE){
      error.statusCode = 400;
    }
    throw error;
  }
}

export default initApiRoute(null, verify, null, null, false);
