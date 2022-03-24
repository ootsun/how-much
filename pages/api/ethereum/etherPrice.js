import initApiRoute from '../../../lib/utils/restApiHelper.js';
import {BLOCK_INTERVAL_IN_MS} from '../../../lib/ethereum/ethereumUtils.js';
import {ethers} from 'ethers';

let etherPrice = null;
let lastRefresh = null;
const EtherscanProvider = new ethers.providers.EtherscanProvider();
refreshEtherPrice();

async function getEtherPrice() {
  if(!lastRefresh || lastRefresh < new Date().getTime() - BLOCK_INTERVAL_IN_MS) {
    await refreshEtherPrice();
  }
  return {etherPrice};
}

async function refreshEtherPrice() {
  etherPrice = await EtherscanProvider.getEtherPrice();
  lastRefresh = new Date().getTime();
}

export default initApiRoute({handle: getEtherPrice}, null, null, null);
