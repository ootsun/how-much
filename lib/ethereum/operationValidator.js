import log from '../log/logger.js';
import {contractIsAProxy, getImplementationAddress, getMethodsOf} from './contractUtils.js';

export default async function functionExists(contractAddress, functionName) {
  try {
    const methods = await getMethodsOf(contractAddress);
    if(methods.includes(functionName)) {
      return true;
    }
    if(!contractIsAProxy(methods)) {
      return false;
    }
    log.debug("Contract is a proxy")
    const implementationAddress = await getImplementationAddress(contractAddress);
    const implementationMethods = await getMethodsOf(implementationAddress);
    if(implementationMethods.includes(functionName)) {
      return implementationAddress;
    }
    return false;
  } catch (error) {
    log.error(error);
    return false;
  }
}
