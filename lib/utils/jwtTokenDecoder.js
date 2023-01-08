import {verify} from 'jsonwebtoken';
import log from '../log/logger.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const getUser = (req) => {
  try {
    if(!req.headers.authorization) {
      log.debug("Missing authorization header");
      throw new Error("Missing authorization header");
    } else {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = verify(token, JWT_SECRET, null, null);
      const user = decodedToken.user;
      if (!user) {
        throw new Error('Invalid JWT token');
      }
      return user;
    }
  } catch (error) {
    error.errorCode = 403;
    throw error;
  }
}
