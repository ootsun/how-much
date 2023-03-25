import {getJSONAuthHeader} from './authHandler.js';
import {BLOCK_INTERVAL_IN_MS} from '../ethereum/ethereumUtils.js';

export const getById = async (id) => {
  return await fetch('/api/operations/' + id);
}

export const findAll = async () => {
  return await fetch('/api/operations');
}

export const search = async (searchCriteria) => {
  return await fetch('/api/operations/search', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(searchCriteria),
  });
}

export const create = async (project, functionName, contractAddress, version, isERC20) => {
  return await fetch('/api/operations', {
    method: 'POST',
    headers: getJSONAuthHeader(),
    body: JSON.stringify({
      project,
      functionName,
      contractAddress,
      version,
      isERC20
    }),
  });
}

export const update = async (_id, project, functionName, contractAddress, version, isERC20) => {
  return await fetch('/api/operations/' + _id, {
    method: 'PUT',
    headers: getJSONAuthHeader(),
    body: JSON.stringify({
      project,
      functionName,
      contractAddress,
      version,
      isERC20
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
  try {
    let res = await fetch('/api/ethereum/prices');
    if(res.ok) {
      const data = await res.json();
      setCurrentEtherPrice(data.etherPrice);
      setCurrentGasPrice(data.gasPriceInWei);
    }
  } catch (e) {
    console.log(e);
  }
}
