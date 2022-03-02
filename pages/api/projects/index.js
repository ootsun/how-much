import initApiRoute from '../../../lib/utils/restApiHelper.js';
import dbConnect from '../../../lib/database/dbConnect.js';
import Project from '../../../models/Project.js';
// Keep the import -> need to initialize the schema
import User from '../../../models/User.js';
import {getUser} from '../../../lib/utils/jwtTokenDecoder.js';
import {capitalizeFirstLetter} from '../../../lib/utils/stringUtils.js';
import log from '../../../lib/log/logger.js';
import * as cloudinary from 'cloudinary';

const PROJECTS_FOLDER_NAME = process.env.CLOUDINARY_PROJECTS_FOLDER_NAME;

async function create(req) {
  let {name, logoUrl} = req.body;
  name = capitalizeFirstLetter(name);

  await dbConnect();
  const user = getUser(req);

  try {
    const project = await Project.create({
      createdBy: user._id,
      name: name,
      logoUrl: logoUrl,
    });
    log.info(`Project ${name} was created by ${user.address}`);
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
    .populate('createdBy', 'address');
}

export default initApiRoute(
  {handle: findAll},
  {handle: create, checkAuth: true},
  null,
  null);
