import nextConnect from 'next-connect';
import log from '../log/logger.js';
import logger from '../log/logger.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export default function initApiRoute(doGet, doPost, doPut, doDelete) {

  const checkAuth = async (req, res, next) => {
    if((!doGet?.checkAuth && req.method === 'GET') ||
      (!doPost?.checkAuth && req.method === 'POST') ||
      (!doPut?.checkAuth && req.method === 'PUT') ||
      (!doDelete?.checkAuth && req.method === 'DELETE')) {
      return next();
    }
    try {
      if(!req.headers.authorization) {
        logger.debug("Missing authorization header");
        const error = new Error("Missing authorization header");
        next(error);
      } else {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, JWT_SECRET);
        next();
      }
    } catch (err) {
      logger.debug(err);
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

  if(doGet) {
    apiRoute.get(checkAuth, async (req, res) => {
      try {
        res.status(200).json(await doGet.handle(req));
      } catch (error) {
        log.error(error);
        let statusCode = error.statusCode || 500;
        res.status(statusCode).json({success: false});
      }
    });
  }

  if(doPost) {
    apiRoute.post(checkAuth, async (req, res) => {
      try {
        res.status(201).json(await doPost.handle(req));
      } catch (error) {
        log.error(error);
        let statusCode = error.statusCode || 500;
        res.status(statusCode).json({success: false});
      }
    });
  }

  return apiRoute;
}
