import { API_ROUTES } from '../utils/constants';
import axios from 'axios';
export function storeTokenInLocalStorage(token) {
  localStorage.setItem('token', token);
}

export function getTokenFromLocalStorage() {
  return localStorage.getItem('token');
}

export async function getAuthenticatedUser() {
  const defaultReturnObject = { authenticated: false, user: null };
  try {
    const token = getTokenFromLocalStorage();
    if (!token) {
      return defaultReturnObject;
    }

    const response = await axios({
      method: 'GET',
      url: API_ROUTES.GET_USER,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (response.data) {
      defaultReturnObject.authenticated = true;
      defaultReturnObject.user = response.data;
    }

    return defaultReturnObject;
  }
  catch (err) {
    console.log('getAuthenticatedUser, Something Went Wrong', err);
    return defaultReturnObject;
  }
}

