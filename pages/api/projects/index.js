import initApiRoute from '../../../lib/utils/restApiHelper.js';
import dbConnect from '../../../lib/database/dbConnect.js';
import Project from '../../../models/Project.js';
import log from '../../../lib/log/logger.js';
import * as fs from 'fs';

async function create(req) {
  await dbConnect();
  let logo = null;
  if(req.files) {
    logo = {
      data: fs.readFileSync(req.files.logo[0].path),
      contentType: req.files.logo[0].headers['content-type']
    }
  }
  const project = await Project.create({
    createdBy: 0,
    name: req.body.name,
    logo: logo,
  });
  log.info(`Project ${req.body.name} was created by ${req.body.user.username}`);
  return project;
}

export default initApiRoute(null, create, null, null, true);

// Required to use the fileUploadMiddleware
export const config = {
  api: {
    bodyParser: false
  }
}
