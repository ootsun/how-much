import getMethodBasedOn from '../../../lib/ethereum/operationValidator.js';
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

async function create(req) {
  let {version, contractAddress, functionName, project, user, isERC20} = req.body;
  functionName = functionName?.trim().toLowerCase();
  contractAddress = contractAddress.trim();
  version = version?.trim() || null;
  const method = await getMethodBasedOn(contractAddress, functionName);
  if (!method) {
    const error = new Error('Function [' + functionName + '] does not exist');
    error.statusCode = 400;
    throw error;
  }
  await dbConnect();
  const operation = await Operation.create({
    createdBy: user._id,
    project: project._id,
    contractAddress: contractAddress,
    implementationAddress: method.implementationAddress,
    functionName: method.name,
    methodId: method.methodId,
    version: version,
    isERC20: isERC20
  });

  log.info(`Operation ${functionName} for ${project.name} was created by ${user.address}`);
  await revalidate('operations');
  return operation;
}

export default initApiRoute({handle: findAll}, {handle: create, checkCanEdit: true}, null, null);
