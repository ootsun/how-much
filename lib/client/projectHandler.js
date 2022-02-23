import {getJSONAuthHeader} from './authHandler.js';

export const findAll = async () => {
  const res = await fetch('/api/projects');
  if (res.ok) {
    return res.json();
  }
  return false;
}

export const getUploadSignature = async (fileName) => {
  const res = await fetch('/api/upload-signatures', {
    headers: getJSONAuthHeader(),
    method: 'POST',
    body: JSON.stringify({fileName})
  });
  if (res.ok) {
    return res.json();
  }
  return false;
}

export const uploadFormData = async (formData, cloudName) => {
  const url = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL.replace("CLOUD_NAME", cloudName);
  const res = await fetch(url, {
    method: 'POST',
    body: formData
  });
  if (res.ok) {
    return res.json();
  }
  return false;
}

export const create = async (name, logoUrl) => {
  const res = await fetch('/api/projects', {
    method: "POST",
    headers: getJSONAuthHeader(),
    body: JSON.stringify({
      name,
      logoUrl
    }),
  });
  if (res.ok) {
    return true;
  }
  console.log(res)
  return false;
}
