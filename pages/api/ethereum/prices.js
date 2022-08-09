import initApiRoute from '../../../lib/utils/restApiHelper.js';
import {BLOCK_INTERVAL_IN_MS} from '../../../lib/ethereum/ethereumUtils.js';
import {ethers} from 'ethers';
import {provider} from '../../../lib/ethereum/ethereumUtils.js';

let prices = null;
let lastRefresh = null;
const EtherscanProvider = new ethers.providers.EtherscanProvider();
refreshPrices();

async function getPrices() {
  if(!lastRefresh || lastRefresh < new Date().getTime() - BLOCK_INTERVAL_IN_MS) {
    await refreshPrices();
  }
  return prices;
}

async function refreshPrices() {
  const resolve = await Promise.all([
    EtherscanProvider.getEtherPrice(),
    provider.getGasPrice()
  ]);
  prices = {
    etherPrice: resolve[0],
    gasPriceInWei: resolve[1].toString()
  };
  lastRefresh = new Date().getTime();
}

export default initApiRoute({handle: getPrices}, null, null, null);
