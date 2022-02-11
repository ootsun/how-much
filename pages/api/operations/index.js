import functionExists from '../../../lib/ethereum/operationValidator.js';
import dbConnect from '../../../lib/database/dbConnect.js';
import Operation from '../../../models/Operation.js';
import log from '../../../lib/log/logger.js';
import initApiRoute from '../../../lib/utils/restApiHelper.js';

async function create(req) {
  const {contractAddress, methodName, project, user} = req.body;
  if(!(await functionExists(contractAddress, methodName))) {
    throw new Error('Method [' + methodName + '] does not exist');
  }
  await dbConnect();
  const operation = await Operation.create({
    createdBy: user.id,
    project: project.id,
    contractAddress: contractAddress,
    methodName: methodName,
  });
  log.info(`Operation ${methodName} for ${project.name} was created by ${user.username}`);
  return operation;
}

export default initApiRoute(null, create, null, null, true);
