import {getJSONAuthHeader} from './authHandler.js';

export const findAll = async () => {
  return await fetch('/api/projects');
}

export const getUploadSignature = async (public_id) => {
  return await fetch('/api/upload-signatures', {
    headers: getJSONAuthHeader(),
    method: 'POST',
    body: JSON.stringify({public_id: public_id})
  });
}

export const uploadImage = async (formData, cloudName) => {
  const url = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL.replace('CLOUD_NAME', cloudName);
  return await fetch(url, {
    method: 'POST',
    body: formData
  });
}

export const create = async (name, logoUrl) => {
  return await fetch('/api/projects', {
    method: 'POST',
    headers: getJSONAuthHeader(),
    body: JSON.stringify({
      name,
      logoUrl
    }),
  });
}

export const update = async (_id, name, logoUrl) => {
  return await fetch('/api/projects/' + _id, {
    method: 'PUT',
    headers: getJSONAuthHeader(),
    body: JSON.stringify({
      name,
      logoUrl
    }),
  });
}

export const deleteProject = async (_id) => {
  return await fetch('/api/projects/' + _id, {
    method: 'DELETE',
    headers: getJSONAuthHeader()
  });
}


