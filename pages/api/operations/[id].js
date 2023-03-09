import initApiRoute from '../../../lib/utils/restApiHelper.js';
import dbConnect from '../../../lib/database/dbConnect.js';
import Operation from '../../../models/Operation.js';
// Keep the imports -> need to initialize the schemas
import User from '../../../models/User.js';
import Project from '../../../models/Project.js';
import log from '../../../lib/log/logger.js';
import {revalidate} from '../../../lib/utils/revalidationHandler.js';

async function getById(req) {
  const {
    query: {id}
  } = req;

  await dbConnect();

  const operation = await Operation.findById(id,
    {
      lastGasUsages: 0,
      createdAt: 0,
      createdBy: 0,
      implementationAddress: 0,
      minGasUsage: 0,
      methodId: 0,
      'project.createdAt': 0,
      'project.createdBy': 0,
      'project.symbol': 0
    })
    .populate('project', 'name logoUrl');
  if (!operation) {
    throw new Error('Operation with _id ' + id + ' not found');
  }
  return operation;
}

async function update(req) {
  const {
    query: {id}
  } = req;
  const {contractAddress, functionName, project, user} = req.body;

  await dbConnect();

  try {
    const operation = await Operation.findByIdAndUpdate(id, {
        contractAddress,
        functionName,
        project: project._id
      },
      {runValidators: true})
      .populate('project', 'name logoUrl');
    if (!operation) {
      throw new Error('Operation with _id ' + id + ' not found');
    }
    log.info(`Operation ${operation.functionName} for ${operation.project.name} was updated by ${user.address}`);
    await revalidate('operations');
    return operation;
  } catch (e) {
    console.log(e)
    //TODO Handle unique validation error
    throw e;
  }
}

async function deleteOperation(req) {
  const {
    query: {id}
  } = req;
  const {user} = req.body;

  await dbConnect();

  const operation = await Operation.findByIdAndDelete(id).populate('project', 'name');
  if (!operation) {
    throw new Error('Operation with _id ' + id + ' not found');
  }
  log.info(`Operation ${operation.functionName} for ${operation.project.name} was deleted by ${user.address}`);
  await revalidate('operations');
  return operation;
}

export default initApiRoute(
  {handle: getById},
  null,
  {handle: update, checkCanEdit: true},
  {handle: deleteOperation, checkCanEdit: true});
