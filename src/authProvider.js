import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_CHECK, AUTH_ERROR, AUTH_GET_PERMISSIONS } from 'react-admin';
import storage from './storage';

export const authProvider = (loginApiUrl, noAccessPage = '/login') => {
  return (type, params) => {
    if (type === AUTH_LOGIN) {
      const request = new Request(loginApiUrl, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      });
      return fetch(request)
        .then(response => {
          if (response.status < 200 || response.status >= 300) {
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .then(({ ttl, ...data }) => {
          storage.save('lbtoken', data, ttl);
        });
    }
    if (type === AUTH_LOGOUT) {
      storage.remove('lbtoken');
      return Promise.resolve();
    }
    if (type === AUTH_ERROR) {
      const { status } = params;
      if (status === 401 || status === 403) {
        storage.remove('lbtoken');
        return Promise.reject();
      }
      return Promise.resolve();
    }
    if (type === AUTH_CHECK) {
      const token = storage.load('lbtoken');
      if (token && token.id) {
        return Promise.resolve();
      } else {
        storage.remove('lbtoken');
        return Promise.reject({ redirectTo: noAccessPage });
      }
    }
    if (type === AUTH_GET_PERMISSIONS) {
        const role = storage.load('lbtoken');
        if (role && role.user.realm) {
            return Promise.resolve(role.user.realm);
        } else {
            storage.remove('lbtoken');
            return Promise.reject({redirecTo: noAccessPage });
        }
    }
    return Promise.reject('Unknown method');
  };
};
