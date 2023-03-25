import log from '../log/logger.js';
import {contractIsAProxy, getImplementationAddress, getMethodsOf} from './contractUtils.js';
import {ethers} from "ethers";

export default async function getMethodIdOf(contractAddress, functionName) {
  try {
    const methods = await getMethodsOf(contractAddress);
    let method = findMethodIn(methods, functionName);
    if(method) {
      return {methodId: ethers.utils.id(method.signature), name: method.name};
    }
    if(!contractIsAProxy(methods)) {
      return null;
    }
    log.debug("Contract is a proxy")
    const implementationAddress = await getImplementationAddress(contractAddress);
    const implementationMethods = await getMethodsOf(implementationAddress);
    method = findMethodIn(implementationMethods, functionName);
    if(method) {
      return {
        methodId: ethers.utils.id(method.signature),
        implementationAddress,
        name: method.name};
    }
  } catch (error) {
    log.error(error);
  }
  return null;
}

const findMethodIn = (methods, functionName) => methods.find(m => m.name.toLowerCase() === functionName);
