import nextConnect from 'next-connect';
import log from '../log/logger.js';
import fileUploadMiddleware from '../middlewares/fileUpload.middleware.js';

export default function initApiRoute(doGet, doPost, doPut, doDelete, fileUpload) {
  const apiRoute = nextConnect({
    onError(error, req, res) {
      log.error(error);
      res.status(501).json({error: `Server error`});
    },
    onNoMatch(req, res) {
      res.status(405).json({error: `Method ${req.method} not allowed`});
    },
  });

  if(fileUpload) {
    apiRoute.use(fileUploadMiddleware);
  }

  if(doGet) {
  }

  if(doPost) {
    apiRoute.post((req, res) => {
      try {
        res.status(201).json(doPost(req));
      } catch (error) {
        log.error(error);
        res.status(400).json({success: false});
      }
    });
  }

  return apiRoute;
}
