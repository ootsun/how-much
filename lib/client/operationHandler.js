import {getJSONAuthHeader} from './authHandler.js';

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


