import initApiRoute from '../../../lib/utils/restApiHelper.js';
import {generateNonce} from 'siwe';
import Nonce from '../../../models/Nonce.js';
import dbConnect from '../../../lib/database/dbConnect.js';
import isValid from '../../../lib/ethereum/addressValidator.js';

async function createNonce(req) {
  const {address} = req.body;
  if(!isValid(address)) {
    throw new Error('Address [' + address + '] is invalid');
  }
  const nonce = generateNonce();
  await dbConnect();
  const oneHourAgo = new Date();
  oneHourAgo.setHours(oneHourAgo.getHours() - 1);
  await Nonce.deleteMany({$or:[{address: address}, {createdAt: {$lte: oneHourAgo}}]});
  await Nonce.create({
    value: nonce,
    address: address
  });
  return nonce;
}

export default initApiRoute(null, createNonce, null, null, false);
