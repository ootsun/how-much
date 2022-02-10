import functionExists from '../../../lib/ethereum/operationValidator.js';
import dbConnect from '../../../lib/database/dbConnect.js';
import Operation from '../../../models/Operation.js';
import log from '../../../lib/log/logger.js';
import initApiRoute from '../../../lib/utils/restApiHelper.js';

async function create(req) {
  if(!(await functionExists(req.body.contractAddress, req.body.methodName))) {
    throw new Error('Method [' + req.body.methodName + '] does not exist');
  }
  await dbConnect();
  const operation = await Operation.create({
    createdBy: 0,
    project: req.body.project.id,
    contractAddress: req.body.contractAddress,
    methodName: req.body.methodName,
  });
  log.info(`Operation ${req.body.methodName} for ${req.body.project.name} was created by ${req.body.user.username}`);
  return operation;
}

export default initApiRoute(null, create, null, null, true);
