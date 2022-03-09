import axios from 'axios';
import {ethers} from 'ethers';
import log from '../log/logger.js';

const ETHERSCAN_TOKEN_API = process.env.ETHERSCAN_TOKEN_API;

const provider = new ethers.providers.getDefaultProvider();

async function getMethodsOf(contractAddress) {
  const res = await axios.get(`https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${ETHERSCAN_TOKEN_API}`);
  const abi = JSON.parse(res.data.result);
  const contract = new ethers.Contract(contractAddress, abi, provider);
  return contract.functions;
}

export default async function functionExists(contractAddress, functionName) {
  try {
    const methods = await getMethodsOf(contractAddress);
    if(Object.keys(methods).includes(functionName)) {
      return true;
    }
    // If is not a proxy contract
    if(!Object.keys(methods).includes('implementation')) {
      return false;
    }
    const implementationAddress = await provider.getStorageAt(contractAddress, '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc');
    const implementationMethods = await getMethodsOf(ethers.utils.hexStripZeros(implementationAddress));
    return Object.keys(implementationMethods).includes(functionName);
  } catch (error) {
    log.error(error);
    return false;
  }
}
