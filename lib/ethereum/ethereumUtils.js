import {ethers} from 'ethers';
import {BigNumber} from 'ethers/lib/ethers.js';

const ETHERSCAN_TOKEN_API = process.env.ETHERSCAN_TOKEN_API;
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const POCKET_PORTAL_ID = process.env.POCKET_PORTAL_ID;

export const BLOCK_INTERVAL_IN_MS = 12000;

export const provider = new ethers.providers.getDefaultProvider(null, {
  etherscan: ETHERSCAN_TOKEN_API,
  infura: INFURA_PROJECT_ID,
  alchemy: ALCHEMY_API_KEY,
  pocket: POCKET_PORTAL_ID
});

export function addressIsValid(address) {
  return ethers.utils.isAddress(address);
}

export function atCurrentGasPriceInUSD(gasQuantity, currentEtherPrice, currentGasPriceInWei) {
  const priceInWei = BigNumber.from(currentGasPriceInWei)
    .mul(BigNumber.from(gasQuantity));
  const priceInEther = Number.parseFloat(ethers.utils.formatEther(priceInWei));
  return priceInEther * currentEtherPrice;
}
