import {getJSONAuthHeader} from './authHandler.js';

export const findAll = async () => {
  return await fetch('/api/projects');
}

export const getUploadSignature = async (fileName) => {
  return await fetch('/api/upload-signatures', {
    headers: getJSONAuthHeader(),
    method: 'POST',
    body: JSON.stringify({fileName})
  });
}

export const uploadFormData = async (formData, cloudName) => {
  const url = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL.replace("CLOUD_NAME", cloudName);
  return await fetch(url, {
    method: 'POST',
    body: formData
  });
}

export const create = async (name, logoUrl) => {
  return await fetch('/api/projects', {
    method: "POST",
    headers: getJSONAuthHeader(),
    body: JSON.stringify({
      name,
      logoUrl
    }),
  });
}
