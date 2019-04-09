/* eslint-disable import/prefer-default-export */
/**
 * @description axiosController Проверяет JWT и обновляет access token и refresh token при протухании access token.
 * Так же добавляет заголовки к запросам и устанавливает baseURL(домен и тип протокола(http))
 * @exports setGlobalApiRequest - Функция для установки свойства $apiRequest глобально в экземпляр Vue
 */

import Vue from 'vue';
import axios from 'axios';
import { AUTH_REFRESH } from './routesToServerApi';

function showWarning(error) {
  const specSymbol = '-'.repeat(100);
  console.log(`%c ${specSymbol}`, 'color:red; font-weight:bold');
  console.log('%c Error by request ', 'color:red; font-weight:bold');
  console.dir(error, { data: error.response.data });
  console.log(`%c ${specSymbol}`, 'color:red; font-weight:bold');
}

axios.defaults.withCredentials = true; // enable cookies

/* options for apiRequest */

const host = process.env.NODE_ENV === 'production'
  ? document.location.origin
  : `//${process.env.VUE_APP_SERVER_HOST}:${
    process.env.VUE_APP_SERVER_PORT
  }`;

// const apiVersion = "v1";
export const apiRequest = axios.create({
  baseURL: `${host}/api/`,
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${localStorage.getItem('user-token')}`,
  },
});

/* set headers every request */

apiRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('user-token');
    if (!token) {
      return config;
    }

    // eslint-disable-next-line no-param-reassign
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };

    return config;
  },
  error => error,
);

/*
  if  `refreshRequest` === null,
    frontend send request for get new refreshTokenJWT
  else
    no
*/

/* check response on 401 error (Unauthorized) */
let refreshRequest = null;
apiRequest.interceptors.response.use(
  r => r,
  (error) => {
    const refreshToken = localStorage.getItem('user-refresh-token');

    if (!error.response) {
      console.error('no response', error);
      return;
    }

    if (error.response.status !== 401 && process.env.NODE_ENV !== 'production') {
      showWarning(error);
    }

    if (!refreshToken || error.response.status !== 401 || error.config.retry) {
      throw error;
    }

    if (!refreshRequest) {
      refreshRequest = apiRequest.post(AUTH_REFRESH, { refreshToken });
    }

    return refreshRequest
      .then(({ data }) => {
        refreshRequest = null;

        localStorage.setItem('user-token', data.token);
        localStorage.setItem('user-refresh-token', data.refreshToken);

        const newRquest = {
          ...error.config,
          retry: true,
        };

        return apiRequest(newRquest);
      })
      .catch(() => {
        localStorage.removeItem('user-token');
        localStorage.removeItem('user-refresh-token');
      });
  },
);

Vue.prototype.$apiRequest = apiRequest; // set global Api Request
