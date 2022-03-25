import initApiRoute from '../../../lib/utils/restApiHelper.js';
import {provider} from '../../../lib/ethereum/ethereumUtils.js';

const BLOCK_INTERVAL = 12000;

let gasPriceInWei = null;
let lastRefresh = null;
refreshGasPrice();

async function getGasPrice() {
  if(!lastRefresh || lastRefresh < new Date().getTime() - BLOCK_INTERVAL) {
    await refreshGasPrice();
  }
  return {gasPriceInWei};
}

async function refreshGasPrice() {
  lastRefresh = new Date().getTime();
  gasPriceInWei = (await provider.getGasPrice()).toString();
}

export default initApiRoute({handle: getGasPrice}, null, null, null);
