import initApiRoute from '../../../lib/utils/restApiHelper.js';
import {BLOCK_INTERVAL_IN_MS} from '../../../lib/ethereum/ethereumUtils.js';
import {ethers} from 'ethers';
import {provider} from '../../../lib/ethereum/ethereumUtils.js';

const NB_MS_IN_10_MIN = 10 * 60 * 1000;

let prices = {};
let lastGasPriceRefresh = null;
let lastEtherPriceRefresh = null;

const EtherscanProvider = new ethers.providers.EtherscanProvider();

async function getPrices() {
  if(!lastGasPriceRefresh || lastGasPriceRefresh < new Date().getTime() - BLOCK_INTERVAL_IN_MS) {
    await refreshGasPrice();
  }
  if(!lastEtherPriceRefresh || lastEtherPriceRefresh < new Date().getTime() - NB_MS_IN_10_MIN) {
    await refreshEthereumPrice();
  }
  return prices;
}

async function refreshGasPrice() {
  prices.gasPriceInWei = (await provider.getGasPrice()).toString();
  lastGasPriceRefresh = new Date().getTime();
}

async function refreshEthereumPrice() {
  prices.etherPrice = await EtherscanProvider.getEtherPrice();
  lastEtherPriceRefresh = new Date().getTime();
}

export default initApiRoute({handle: getPrices}, null, null, null);
