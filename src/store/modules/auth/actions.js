import types from './TYPES';

import * as api from '../../../axios/routesToServerApi';
import { apiRequest } from '../../../axios/axiosController';

const { AUTH_LOGOUT } = types;

const { LOGOUT } = api;

export default {
	[AUTH_LOGOUT]: ({ commit }) =>
		new Promise((resolve) => {
			commit(AUTH_LOGOUT);
			apiRequest.get(LOGOUT);
			localStorage.removeItem('user-token');
			resolve();
		}),
};
