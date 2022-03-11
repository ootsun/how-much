import axios from 'axios';
import {ethers} from 'ethers';
import {provider} from './ethereumUtils.js';

const ETHERSCAN_TOKEN_API = process.env.ETHERSCAN_TOKEN_API;

export async function getMethodsOf(contractAddress) {
  const res = await axios.get(`https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${ETHERSCAN_TOKEN_API}`);
  const abi = JSON.parse(res.data.result);
  const iface = new ethers.utils.Interface(abi);
  return Object.values(iface.functions).map(f => f.name);
}

export function contractIsAProxy(methods, iface) {
  if (!methods) {
    methods = Object.values(iface.functions).map(f => f.name);
  }
  return methods.includes('implementation');
}

export async function getImplementationAddress(contractAddress) {
  const address = await provider.getStorageAt(contractAddress, '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc');
  return ethers.utils.hexStripZeros(address);
}
