import initApiRoute from '../../../lib/utils/restApiHelper.js';
import dbConnect from '../../../lib/database/dbConnect.js';
import Project from '../../../models/Project.js';
import log from '../../../lib/log/logger.js';
import * as fs from 'fs';

async function create(req) {
  const {user, name} = req.body;
  await dbConnect();
  let logo = null;
  if(req.files) {
    logo = {
      data: fs.readFileSync(req.files.logo[0].path),
      contentType: req.files.logo[0].headers['content-type']
    }
  }
  const project = await Project.create({
    createdBy: user.id,
    name: name,
    logo: logo,
  });
  log.info(`Project ${name} was created by ${user.username}`);
  return project;
}

export default initApiRoute(null, create, null, null, true);

// Required to use the fileUploadMiddleware
export const config = {
  api: {
    bodyParser: false
  }
}
