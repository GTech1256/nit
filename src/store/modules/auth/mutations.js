import types from './TYPES';

const { AUTH_REQUEST, AUTH_SUCCESS, AUTH_ERROR, AUTH_LOGOUT } = types;

export default {
	[AUTH_REQUEST]: (state) => {
		state.status = 'loading';
	},
	[AUTH_SUCCESS]: (state, payload) => {
		state.status = 'success';
		state.token = payload.user_token;
		state.hasLoadedOnce = true;
	},
	[AUTH_ERROR]: (state) => {
		state.status = 'error';
		state.hasLoadedOnce = true;
	},
	[AUTH_LOGOUT]: (state) => {
		state.token = '';
	},
};
