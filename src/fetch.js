import { fetchUtils } from 'react-admin';
import storage from './storage';

export default (url, options = {}) => {
  options.user = {
      authenticated: true,
      token: storage.load('lbtoken').id
  };
  return fetchUtils.fetchJson(url, options);
}
