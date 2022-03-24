import {getJSONAuthHeader} from './authHandler.js';
import {BLOCK_INTERVAL_IN_MS} from '../ethereum/ethereumUtils.js';

export const findAll = async () => {
  return await fetch('/api/operations');
}

export const create = async (project, functionName, contractAddress) => {
  return await fetch('/api/operations', {
    method: 'POST',
    headers: getJSONAuthHeader(),
    body: JSON.stringify({
      project,
      functionName,
      contractAddress
    }),
  });
}

export const update = async (_id, project, functionName, contractAddress) => {
  return await fetch('/api/operations/' + _id, {
    method: 'PUT',
    headers: getJSONAuthHeader(),
    body: JSON.stringify({
      project,
      functionName,
      contractAddress
    }),
  });
}

export const deleteOperation = async (_id) => {
  return await fetch('/api/operations/' + _id, {
    method: 'DELETE',
    headers: getJSONAuthHeader()
  });
}

export const refreshPricesAutomatically = (setCurrentEtherPrice, setCurrentGasPrice) => {
  refreshPrices(setCurrentEtherPrice, setCurrentGasPrice);
  return setInterval(() => {
    refreshPrices(setCurrentEtherPrice, setCurrentGasPrice);
  }, BLOCK_INTERVAL_IN_MS);
}

const refreshPrices = async (setCurrentEtherPrice, setCurrentGasPrice) => {
  let res = await fetch('/api/ethereum/etherPrice');
  setCurrentEtherPrice((await res.json()).etherPrice);
  res = await fetch('/api/ethereum/gasPrice');
  setCurrentGasPrice((await res.json()).gasPriceInWei);
}
