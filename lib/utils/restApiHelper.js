import nextConnect from 'next-connect';
import log from '../log/logger.js';
import {verify} from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export default function initApiRoute(doGet, doPost, doPut, doDelete) {

  const checkAuth = async (req, res, next) => {
    if ((!doGet?.checkAuth && req.method === 'GET') ||
      (!doPost?.checkAuth && req.method === 'POST') ||
      (!doPut?.checkAuth && req.method === 'PUT') ||
      (!doDelete?.checkAuth && req.method === 'DELETE')) {
      return next();
    }
    try {
      extractUserFromToken(req);
      next();
    } catch (error) {
      log.debug(error);
      next(error);
    }
  }

  const extractUserFromToken = (req) => {
    if (!req.headers.authorization) {
      throw new Error('Missing authorization header');
    }
    const token = req.headers.authorization.split(' ')[1];
    if(!token) {
      throw new Error('Missing JWT token');
    }
    const decodedToken = verify(token, JWT_SECRET, null, null);
    const user = decodedToken.user;
    if (!user) {
      throw new Error('Invalid JWT token');
    }
    req.body.user = user;
  }

  const checkCanEdit = async (req, res, next) => {
    if ((!doGet?.checkCanEdit && req.method === 'GET') ||
      (!doPost?.checkCanEdit && req.method === 'POST') ||
      (!doPut?.checkCanEdit && req.method === 'PUT') ||
      (!doDelete?.checkCanEdit && req.method === 'DELETE')) {
      return next();
    }
    try {
      extractUserFromToken(req);
      const user = req.body.user;
      if(!user.canEdit) {
        throw new Error('User has no edition right');
      }
      next();
    } catch (error) {
      log.debug(error);
      next(error);
    }
  }

  const apiRoute = nextConnect({
    onError(error, req, res) {
      log.error(`Request ${req.url} failed :`);
      log.error(error);
      let statusCode = error.statusCode || 500;
      res.status(statusCode).json({error: `Server error`});
    },
    onNoMatch(req, res) {
      res.status(405).json({error: `Method ${req.method} not allowed`});
    },
  });

  try {
    if (doGet) {
      apiRoute.get(checkAuth, checkCanEdit, async (req, res) => {
        res.status(200).json(await doGet.handle(req, res));
      });
    }

    if (doPost) {
      apiRoute.post(checkAuth, checkCanEdit, async (req, res) => {
        res.status(201).json(await doPost.handle(req, res));
      });
    }

    if (doPut) {
      apiRoute.put(checkAuth, checkCanEdit, async (req, res) => {
        res.status(200).json(await doPut.handle(req, res));
      });
    }

    if (doDelete) {
      apiRoute.delete(checkAuth, checkCanEdit, async (req, res) => {
        res.status(200).json(await doDelete.handle(req, res));
      });
    }
  } catch (error) {
    log.error(error);
    let statusCode = error.statusCode || 500;
    res.status(statusCode).json({success: false});
  }

  return apiRoute;
}
