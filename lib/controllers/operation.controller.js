import dbConnect from '../database/dbConnect.js';
import log from '../log/logger.js';
import functionExists from '../ethereum/operationValidator.js';
import Operation from '../../models/Operation.js';

export default async function create(req) {
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
