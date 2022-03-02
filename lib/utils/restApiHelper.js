import nextConnect from 'next-connect';
import log from '../log/logger.js';
import jwt from 'jsonwebtoken';

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
      if (!req.headers.authorization) {
        log.debug('Missing authorization header');
        const error = new Error('Missing authorization header');
        next(error);
      } else {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, JWT_SECRET, null, null);
        const user = decodedToken.user;
        if (!user) {
          throw new Error('Invalid JWT token');
        }
        req.body.user = user;
        next();
      }
    } catch (err) {
      log.debug(err);
      const error = new Error(err);
      next(error);
    }
  }

  const apiRoute = nextConnect({
    onError(error, req, res) {
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
      apiRoute.get(checkAuth, async (req, res) => {
        res.status(200).json(await doGet.handle(req));
      });
    }

    if (doPost) {
      apiRoute.post(checkAuth, async (req, res) => {
        res.status(201).json(await doPost.handle(req));
      });
    }

    if (doPut) {
      apiRoute.put(checkAuth, async (req, res) => {
        res.status(200).json(await doPut.handle(req));
      });
    }

    if (doDelete) {
      apiRoute.delete(checkAuth, async (req, res) => {
        res.status(200).json(await doDelete.handle(req));
      });
    }
  } catch (error) {
    log.error(error);
    let statusCode = error.statusCode || 500;
    res.status(statusCode).json({success: false});
  }

  return apiRoute;
}
