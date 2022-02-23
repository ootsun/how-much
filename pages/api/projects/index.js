import initApiRoute from '../../../lib/utils/restApiHelper.js';
import dbConnect from '../../../lib/database/dbConnect.js';
import Project from '../../../models/Project.js';
import {getUser} from '../../../lib/utils/jwtTokenDecoder.js';
import {capitalizeFirstLetter} from '../../../lib/utils/stringUtils.js';
import log from '../../../lib/log/logger.js';

async function create(req) {
  let {name, logoUrl} = req.body;
  name = capitalizeFirstLetter(name);

  await dbConnect();
  const user = getUser(req);

  const project = await Project.create({
    createdBy: user._id,
    name: name,
    logoUrl: logoUrl,
  });
  log.info(`Project ${name} was created by ${user.address}`);
  return project;
}

async function findAll(req) {
  await dbConnect();
  return Project.find()
    .populate("user", "address");
}

export default initApiRoute({handle: findAll}, {handle: create, checkAuth: true}, null, null);
