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

async function update(req) {
  const {
    query: { id }
  } = req;
  let {name, logoUrl} = req.body;
  name = capitalizeFirstLetter(name).trim();

  await dbConnect();
  const user = getUser(req);

  const project = await Project.findByIdAndUpdate(id, {
      name,
      logoUrl
    },
    {
      runValidators: true
    });
  if (!project) {
    throw new Error('Project with _id ' + id + ' not found');
  }
  log.info(`Project ${name} was updated by ${user.address}`);
  return project;
}

async function deleteProject(req) {
  const {
    query: { id }
  } = req;

  await dbConnect();
  const user = getUser(req);

  const project = await Project.findByIdAndDelete(id);
  if (!project) {
    throw new Error('Project with _id ' + id + ' not found');
  }

  const res = await cloudinary.v2.uploader.destroy(PROJECTS_FOLDER_NAME + "/" + project.name);
  log.info(`Delete cloudinary image result : ${res.result}`);

  log.info(`Project ${project.name} was deleted by ${user.address}`);
  return project;
}

export default initApiRoute(
  null,
  null,
  {handle: update, checkAuth: true},
  {handle: deleteProject, checkAuth: true});
