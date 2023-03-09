import initApiRoute from '../../../lib/utils/restApiHelper.js';
import dbConnect from '../../../lib/database/dbConnect.js';
import Project from '../../../models/Project.js';
// Keep the import -> need to initialize the schema
import User from '../../../models/User.js';
import {getUser} from '../../../lib/utils/jwtTokenDecoder.js';
import {capitalizeFirstLetter} from '../../../lib/utils/stringUtils.js';
import log from '../../../lib/log/logger.js';
import * as cloudinary from 'cloudinary';
import {revalidate} from '../../../lib/utils/revalidationHandler.js';

const PROJECTS_FOLDER_NAME = process.env.CLOUDINARY_PROJECTS_FOLDER_NAME;

async function update(req) {
  const {
    query: { id }
  } = req;
  let {name, logoUrl, user} = req.body;
  name = capitalizeFirstLetter(name).trim();

  await dbConnect();

  try {
    const project = await Project.findByIdAndUpdate(id, {
        name,
        logoUrl
      },
      { runValidators: true, context: 'query' });
    if (!project) {
      throw new Error('Project with _id ' + id + ' not found');
    }
    log.info(`Project ${project.name} was updated by ${user.address}`);

    await revalidate('projects');
    return project;
  } catch (e) {
    if(e.errors?.name?.kind === 'unique' && e.errors?.name?.path === 'name') {
      const error = new Error('This project already exists');
      error.statusCode = 400;
      throw error;
    }
  }
}

async function deleteProject(req) {
  const {
    query: { id }
  } = req;
  const {user} = req.body;

  await dbConnect();

  const project = await Project.findByIdAndDelete(id);
  if (!project) {
    throw new Error('Project with _id ' + id + ' not found');
  }

  const cloudinaryRes = await cloudinary.v2.uploader.destroy(PROJECTS_FOLDER_NAME + "/" + project.name);
  log.info(`Delete cloudinary image result : ${cloudinaryRes.result}`);

  log.info(`Project ${project.name} was deleted by ${user.address}`);

  await revalidate('projects');
  return project;
}

export default initApiRoute(
  null,
  null,
  {handle: update, checkCanEdit: true},
  {handle: deleteProject, checkCanEdit: true});
