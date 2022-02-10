import axios from 'axios';
import Web3 from 'web3';
import log from '../log/logger.js';

const ETHERSCAN_TOKEN_API = process.env.ETHERSCAN_TOKEN_API;
const RPC_URL = process.env.RPC_URL;

const web3 = new Web3(RPC_URL);

export default async function functionExists(contractAddress, functionName) {
  try {
    const res = await axios.get(`https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${ETHERSCAN_TOKEN_API}`);
    const abi = JSON.parse(res.data.result);
    const contract = new web3.eth.Contract(abi);
    const methods = contract.methods;
    return Object.keys(methods).includes(functionName);
  } catch (error) {
    log.error(error);
    return false;
  }
}
