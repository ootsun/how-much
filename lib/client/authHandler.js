import {LOCAL_STORAGE_KEYS} from './constants.js';
import jwt_decode from 'jwt-decode';

let user = null;

export const saveJWTToken = (token) => {
  localStorage.setItem(LOCAL_STORAGE_KEYS.jwtToken, token);
}

export const isAuthenticated = () => {
  return typeof window !== 'undefined' && !!localStorage.getItem(LOCAL_STORAGE_KEYS.jwtToken);
}

export const isAdmin = () => {
  if(!user) {
    decodeUser();
  }
  return user?.isAdmin;
}

export const getUserAddress = () => {
  if(!user) {
    decodeUser();
  }
  return user?.address;
}

export const getNonce = async (address) => {
  return await fetch('/api/nonce', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({address})
  });
}

export const verifySignature = async (message, signature) => {
  const res = await fetch('/api/verify', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      signature
    }),
  });
  if(res.ok) {
    const data = await res.json();
    saveJWTToken(data.token);
    return true;
  }
  return false;
}

const decodeUser = () => {
  if(typeof window !== 'undefined') {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.jwtToken);
    if(token) {
      const decodedToken = jwt_decode(token);
      user = decodedToken.user;
    }
  }
}
