import { apiRequest } from '../../../axios/axiosController';

import types from './TYPES';

import {
  USER_DATA,
  AUTH_LOGOUT,
  AUTH_SIGNIN,
  FILE_UPLOAD,
  FILE_REMOVE,
} from '../../../axios/routesToServerApi';

const {
  LOAD_USER_DATA,
  AUTH_LOGOUT: AUTH_LOGOUT_STORE,
  AUTH_SIGNIN: AUTH_SIGNIN_STORE,
  FILE_UPLOAD: FILE_UPLOAD_STORE,
  FILE_REMOVE: FILE_REMOVE_STORE,
} = types;

export default {
  [LOAD_USER_DATA]: ({ commit }) => {
    // apiRequest.defaults.headers.Authorization = `Bearer ${localStorage.getItem('user-token')}`;
    apiRequest
      .get(USER_DATA)
      .then((payload) => {
        commit(LOAD_USER_DATA, payload);
      })
      .catch(() => {
        commit(LOAD_USER_DATA, {});
        localStorage.removeItem('user-token');
        localStorage.removeItem('user-refresh-token');
      });
  },
  [AUTH_SIGNIN_STORE]: ({ dispatch }, payload) => {
    apiRequest.post(AUTH_SIGNIN, payload).then(({ data }) => {
      localStorage.setItem('user-token', data.token);
      localStorage.setItem('user-refresh-token', data.refreshToken);
      dispatch(LOAD_USER_DATA);
    });
  },
  [AUTH_LOGOUT_STORE]: ({ commit }) => {
    apiRequest.post(AUTH_LOGOUT).then(() => commit(AUTH_LOGOUT_STORE));
  },
  [FILE_UPLOAD_STORE]({ commit }, payload) {
    apiRequest.post(FILE_UPLOAD, payload).then(({ data }) => commit(FILE_UPLOAD_STORE, data));
  },
  [FILE_REMOVE_STORE]({ commit }, payload) {
    apiRequest.post(FILE_REMOVE, payload).then(() => commit(FILE_REMOVE_STORE, payload));
  },
};
