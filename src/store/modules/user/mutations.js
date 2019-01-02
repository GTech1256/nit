/* eslint-disable no-param-reassign */
import types from './TYPES';

const {
 LOAD_USER_DATA, AUTH_LOGOUT, FILE_UPLOAD, FILE_REMOVE 
} = types;

export default {
  [LOAD_USER_DATA](state, { data }) {
    state.profile = data;
  },
  [AUTH_LOGOUT](state) {
    state.profile = {};
    localStorage.removeItem('user-token');
    localStorage.removeItem('user-refresh-token');
  },
  [FILE_UPLOAD](state, payload) {
    state.profile.files.push(payload);
  },
  [FILE_REMOVE](state, { name }) {
    state.profile.files = state.profile.files.filter(file => file.name !== name);
  },
};
