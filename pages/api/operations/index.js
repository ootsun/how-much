import functionExists from '../../../lib/ethereum/operationValidator.js';
import dbConnect from '../../../lib/database/dbConnect.js';
import Operation from '../../../models/Operation.js';
import log from '../../../lib/log/logger.js';
import initApiRoute from '../../../lib/utils/restApiHelper.js';

async function create(req) {
  const {contractAddress, functionName, project, user} = req.body;
  if(!(await functionExists(contractAddress, functionName))) {
    throw new Error('Function [' + functionName + '] does not exist');
  }
  await dbConnect();
  const operation = await Operation.create({
    createdBy: user.id,
    project: project.id,
    contractAddress: contractAddress,
    functionName: functionName,
  });
  log.info(`Operation ${functionName} for ${project.name} was created by ${user.username}`);
  return operation;
}

export default initApiRoute(null, create, null, null, true);
