import initApiRoute from '../../../lib/utils/restApiHelper.js';
import dbConnect from '../../../lib/database/dbConnect.js';
import Project from '../../../models/Project.js';
// Keep the import -> need to initialize the schema
import User from '../../../models/User.js';
import {capitalizeFirstLetter} from '../../../lib/utils/stringUtils.js';
import log from '../../../lib/log/logger.js';
import {revalidate} from '../../../lib/utils/revalidationHandler.js';

async function create(req) {
  let {name, logoUrl, user} = req.body;
  name = capitalizeFirstLetter(name.trim());

  await dbConnect();

  try {
    const project = await Project.create({
      createdBy: user._id,
      name: name,
      logoUrl: logoUrl,
    });
    log.info(`Project ${name} was created by ${user.address}`);
    await revalidate('projects');
    return project;
  } catch (e) {
    if(e.errors?.name?.kind === 'unique' && e.errors?.name?.path === 'name') {
      const error = new Error('This project already exists');
      error.statusCode = 400;
      throw error;
    }
    throw e;
  }
}

export async function findAll() {
  await dbConnect();
  return Project.find()
    .populate("createdBy", "address avatarUrl")
}

export default initApiRoute(
  {handle: findAll},
  {handle: create, checkAuth: true},
  null,
  null);
