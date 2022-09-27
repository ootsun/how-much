import functionExists from '../../../lib/ethereum/operationValidator.js';
import dbConnect from '../../../lib/database/dbConnect.js';
import Operation from '../../../models/Operation.js';
// Keep the import -> need to initialize the schema
import User from '../../../models/User.js';
import Project from '../../../models/Project.js';
import log from '../../../lib/log/logger.js';
import initApiRoute from '../../../lib/utils/restApiHelper.js';
import {revalidate} from '../../../lib/utils/revalidationHandler.js';

export async function findAll() {
  await dbConnect();
  return Operation.find()
    .populate('createdBy', 'address avatarUrl')
    .populate('project', 'name logoUrl');
}

export async function findAllWithLastGasUsages() {
  await dbConnect();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate()-1);
    const allOperations = await Operation.find({ 'lastGasUsages.9': { $exists: true } })
      .populate('createdBy', 'address avatarUrl')
      .populate('project', 'name logoUrl');
  return allOperations.filter(op => op.lastGasUsages[op.lastGasUsages.length - 9].txDate.getTime() > yesterday.getTime());
}

async function create(req) {
  let {contractAddress, functionName, project, user} = req.body;
  functionName = functionName?.trim().toLowerCase();
  const exists = await functionExists(contractAddress, functionName);
  if (exists === false) {
    const error = new Error('Function [' + functionName + '] does not exist');
    error.statusCode = 400;
    throw error;
  }
  await dbConnect();
  const operation = await Operation.create({
    createdBy: user._id,
    project: project._id,
    contractAddress: contractAddress,
    implementationAddress: typeof exists === 'string' ? exists : undefined,
    functionName: functionName,
  });

  log.info(`Operation ${functionName} for ${project.name} was created by ${user.username}`);
  await revalidate('operations');
  return operation;
}

const isPopular = () => {
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  return operation => operation.lastGasUsages.length >= 10
      && operation.lastGasUsages[operation.lastGasUsages.length - 9].txDate.getTime() > new Date() - twoDaysAgo.getTime();
}

export default initApiRoute({handle: findAll}, {handle: create, checkAuth: true}, null, null);
