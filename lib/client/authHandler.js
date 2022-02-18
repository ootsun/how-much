import {LOCAL_STORAGE_KEYS} from './constants.js';
import jwt_decode from 'jwt-decode';
import React, {createContext} from 'react';

let user = null;

const saveJWTToken = (token) => {
  localStorage.setItem(LOCAL_STORAGE_KEYS.jwtToken, token);
}

export const signOut = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.jwtToken);
  user = null;
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
    saveJWTToken(data.token);
    return true;
  }
  return false;
}

export const isStillAuthenticated = () => {
  return typeof window !== 'undefined' && !!localStorage.getItem(LOCAL_STORAGE_KEYS.jwtToken);
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

export const authContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: (auth) => {}
});
