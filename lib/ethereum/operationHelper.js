import log from '../log/logger.js';
import {contractIsAProxy, getAbiOf, getImplementationAddress, getMethodsFrom, getMethodsOf} from './contractUtils.js';

export default async function getMethodIdOf(contractAddress, functionName) {
  try {
    const abi = await getAbiOf(contractAddress);
    const methods = await getMethodsFrom(abi);
    let method = findMethodIn(methods, functionName);
    if(method) {
      return method;
    }
    if(!contractIsAProxy(methods)) {
      return null;
    }
    log.debug("Contract is a proxy")
    const implementationAddress = await getImplementationAddress(abi, contractAddress);
    const implementationMethods = await getMethodsOf(implementationAddress);
    method = findMethodIn(implementationMethods, functionName);
    if(method) {
      method.implementationAddress = implementationAddress;
      return method;
    }
  } catch (error) {
    log.error(error);
  }
  return null;
}

const findMethodIn = (methods, functionName) => methods.find(m => m.name.toLowerCase() === functionName);
