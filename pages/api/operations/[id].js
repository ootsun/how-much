import initApiRoute from '../../../lib/utils/restApiHelper.js';
import dbConnect from '../../../lib/database/dbConnect.js';
import Operation from '../../../models/Operation.js';
// Keep the imports -> need to initialize the schemas
import User from '../../../models/User.js';
import Project from '../../../models/Project.js';
import log from '../../../lib/log/logger.js';
import {revalidate} from '../../../lib/utils/revalidationHandler.js';

async function update(req) {
  const {
    query: { id }
  } = req;
  const {contractAddress, functionName, project, user} = req.body;

  await dbConnect();

  try {
    const operation = await Operation.findByIdAndUpdate(id, {
        contractAddress,
        functionName,
        project: project._id
      },
      { runValidators: true})
      .populate('project', 'name');
    if (!operation) {
      throw new Error('Operation with _id ' + id + ' not found');
    }
    log.info(`Operation ${operation.functionName} for ${operation.project.name} was updated by ${user.username}`);
    await revalidate('operations');
    revalidate();
    return operation;
  } catch (e) {
    console.log(e)
    //TODO Handle unique validation error
    throw e;
  }
}

async function deleteOperation(req) {
  const {
    query: { id }
  } = req;
  const {user} = req.body;

  await dbConnect();

  const operation = await Operation.findByIdAndDelete(id);
  if (!operation) {
    throw new Error('Operation with _id ' + id + ' not found');
  }

  log.info(`Operation ${operation.functionName} for ${operation.project.name} was deleted by ${user.username}`);
  await revalidate('operations');
  revalidate();
  return operation;
}

export default initApiRoute(
  null,
  null,
  {handle: update, checkAuth: true},
  {handle: deleteOperation, checkAuth: true});
