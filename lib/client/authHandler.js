import {LOCAL_STORAGE_KEYS} from './constants.js';
import jwt_decode from 'jwt-decode';
import React from 'react';

let user = null;

const saveJWTToken = (token) => {
  localStorage.setItem(LOCAL_STORAGE_KEYS.jwtToken, token);
}

export const signOut = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.jwtToken);
  user = null;
}

export const getUserAddress = () => {
  if(!user) {
    decodeUser();
  }
  return user?.address;
}

export const getUserCanEdit = () => {
  if(!user) {
    decodeUser();
  }
  return user?.canEdit;
}

export const getUserAvatarUrl = () => {
  if(!user) {
    decodeUser();
  }
  return user?.avatarUrl;
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
    if(data.token) {
      saveJWTToken(data.token);
      decodeUser();
      return user;
    }
  }
  return null;
}

export const isStillAuthenticated = () => {
  return typeof window !== 'undefined' && !!localStorage.getItem(LOCAL_STORAGE_KEYS.jwtToken);
}

export const getJWTToken = () => {
  if(typeof window !== 'undefined') {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.jwtToken);
  }
}

export const getJSONAuthHeader = () => {
  return  {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + getJWTToken()
  };
}

const decodeUser = () => {
    const token = getJWTToken();
    if(token) {
      const decodedToken = jwt_decode(token);
      user = decodedToken.user;
    }
}
