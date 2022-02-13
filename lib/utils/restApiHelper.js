import nextConnect from 'next-connect';
import log from '../log/logger.js';
import fileUploadMiddleware from '../middlewares/fileUpload.middleware.js';

export default function initApiRoute(doGet, doPost, doPut, doDelete, fileUpload) {
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

  if(fileUpload) {
    apiRoute.use(fileUploadMiddleware);
  }

  if(doGet) {
    apiRoute.get(async (req, res) => {
      try {
        res.status(200).json(await doGet(req));
      } catch (error) {
        log.error(error);
        let statusCode = error.statusCode || 500;
        res.status(statusCode).json({success: false});
      }
    });
  }

  if(doPost) {
    apiRoute.post(async (req, res) => {
      try {
        res.status(201).json(await doPost(req));
      } catch (error) {
        log.error(error);
        let statusCode = error.statusCode || 500;
        res.status(statusCode).json({success: false});
      }
    });
  }

  return apiRoute;
}
