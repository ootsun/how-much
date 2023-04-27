import axios from 'axios';
import {ethers} from 'ethers';
import {provider} from './ethereumUtils.js';
import log from "../log/logger.js";

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
  log.debug(`Getting ABI of ${contractAddress}...`);
  const res = await axios.get(`https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${ETHERSCAN_TOKEN_API}`);
  if (res.data.message === 'NOTOK') {
    throw new Error(`Etherscan error: ${res.data.result}`);
  }
  return JSON.parse(res.data.result);
}

export function contractIsAProxy(methods, iface) {
  if (!methods) {
    methods = Object.values(iface.functions).map(f => f.name);
  }
  return methods.map(m => m.name).includes('implementation')
    || methods.map(m => m.name).includes('getImplementation')
    || methods.map(m => m.name).includes('getTarget');
}

export async function getImplementationAddress(abi, contractAddress) {
  const contract = new ethers.Contract(contractAddress, abi, provider);
  const implementationAddress = await tryUsingFunctions(contract);
  if(implementationAddress) {
    return implementationAddress;
  }

  //See https://ethereum.stackexchange.com/questions/99812/finding-the-address-of-the-proxied-to-address-of-a-proxy
  const eip1967ImplementationStorageSlot = '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc';
  const openzeppelinImplementationStorageSlot = '0x7050c9e0f4ca769c69bd3a8ef740bc37934f8e2c036e5a723fd8ee048ed3f8c3';
  //https://eips.ethereum.org/EIPS/eip-1822
  const eip1822ImplementationStorageSlot = '0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7';
  const slots = [eip1967ImplementationStorageSlot, openzeppelinImplementationStorageSlot, eip1822ImplementationStorageSlot];
  for(let slot of slots) {
    let rawAddress = await provider.getStorageAt(contractAddress, slot);
    let address = ethers.utils.hexStripZeros(rawAddress);
    if(address && address !== '0x') {
      return address;
    }
  }

  throw new Error('Could not find implementation address');
}

export function getMethodId(signature) {
  const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(signature));
  return hash.slice(0, 10);
}

async function tryUsingFunctions(contract) {
  const functionNames = ['implementation', 'getImplementation', 'getTarget'];
  for(let functionName of functionNames) {
    const implementationFunction = contract.interface.functions[functionName + '()'];
    if(implementationFunction && (implementationFunction.stateMutability === 'view' || implementationFunction.stateMutability === 'pure')) {
      const implementationAddress = await contract[functionName]();
      if (implementationAddress !== ethers.constants.AddressZero && implementationAddress !== '0x') {
        return implementationAddress;
      }
    }
  }
  return null;
}
