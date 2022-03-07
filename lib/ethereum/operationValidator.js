import axios from 'axios';
import {ethers} from 'ethers';
import log from '../log/logger.js';

const ETHERSCAN_TOKEN_API = process.env.ETHERSCAN_TOKEN_API;

const provider = new ethers.providers.getDefaultProvider();

export default async function functionExists(contractAddress, functionName) {
  try {
    const res = await axios.get(`https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${ETHERSCAN_TOKEN_API}`);
    const abi = JSON.parse(res.data.result);
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const methods = contract.functions;
    return Object.keys(methods).includes(functionName);
  } catch (error) {
    log.error(error);
    return false;
  }
}
