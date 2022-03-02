import functionExists from '../../../lib/ethereum/operationValidator.js';
import dbConnect from '../../../lib/database/dbConnect.js';
import Operation from '../../../models/Operation.js';
// Keep the import -> need to initialize the schema
import User from '../../../models/User.js';
import Project from '../../../models/Project.js';
import log from '../../../lib/log/logger.js';
import initApiRoute from '../../../lib/utils/restApiHelper.js';
import {revalidate} from '../../../lib/utils/revalidationHandler.js';

async function findAll() {
  await dbConnect();
  return Operation.find()
    .populate("createdBy", "address avatarUrl")
    .populate("project", "name logoUrl");
}

async function create(req) {
  const {contractAddress, functionName, project, user} = req.body;

  if(!(await functionExists(contractAddress, functionName))) {
    const error = new Error('Function [' + functionName + '] does not exist');
    error.statusCode = 400;
    throw error;
  }

  await dbConnect();
  const operation = await Operation.create({
    createdBy: user._id,
    project: project._id,
    contractAddress: contractAddress,
    functionName: functionName,
  });

  log.info(`Operation ${functionName} for ${project.name} was created by ${user.username}`);
  await revalidate('operations');
  revalidate();
  return operation;
}

export default initApiRoute({handle: findAll}, {handle: create, checkAuth: true}, null, null);
