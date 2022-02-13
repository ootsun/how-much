import {ethers} from 'ethers';

export default function isValid(address) {
  return ethers.utils.isAddress(address);
}
