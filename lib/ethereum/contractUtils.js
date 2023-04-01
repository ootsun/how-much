import axios from 'axios';
import {ethers} from 'ethers';
import {provider} from './ethereumUtils.js';

const ETHERSCAN_TOKEN_API = process.env.ETHERSCAN_TOKEN_API;

export async function getMethodsFrom(abi) {
  const iface = new ethers.utils.Interface(abi);
  return Object.values(iface.functions).map((func) => {
    const signature = func.format();
    const name = func.name;
    return { methodId: getMethodId(signature), name };
  });
}

export async function getMethodsOf(contractAddress) {
  const abi = await getAbiOf(contractAddress);
  return await getMethodsFrom(abi);
}

export async function getAbiOf(contractAddress) {
  const res = await axios.get(`https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${ETHERSCAN_TOKEN_API}`);
  return JSON.parse(res.data.result);
}

export function contractIsAProxy(methods, iface) {
  if (!methods) {
    methods = Object.values(iface.functions).map(f => f.name);
  }
  return methods.map(m => m.name).includes('implementation') || methods.map(m => m.name).includes('getImplementation');
}

export async function getImplementationAddress(abi, contractAddress) {
  const contract = new ethers.Contract(contractAddress, abi, provider);

  const implementationFunctionExists = contract.interface.functions['implementation'] !== undefined;
  if(implementationFunctionExists) {
    const implementationAddress = await contract.implementation();
    if (implementationAddress !== ethers.constants.AddressZero && implementationAddress !== '0x') {
      return implementationAddress;
    }
  }

  //See https://ethereum.stackexchange.com/questions/99812/finding-the-address-of-the-proxied-to-address-of-a-proxy
  const eip1967ImplementationStorageSlot = '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc';
  const openzeppelinImplementationStorageSlot = '0x7050c9e0f4ca769c69bd3a8ef740bc37934f8e2c036e5a723fd8ee048ed3f8c3';
  let rawAddress = await provider.getStorageAt(contractAddress, eip1967ImplementationStorageSlot);
  let address = ethers.utils.hexStripZeros(rawAddress);
  if(address === '0x') {
    rawAddress = await provider.getStorageAt(contractAddress, openzeppelinImplementationStorageSlot);
    address = ethers.utils.hexStripZeros(rawAddress);
  }
  return address;
}

export function getMethodId(signature) {
  const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(signature));
  return hash.slice(0, 4);
}
