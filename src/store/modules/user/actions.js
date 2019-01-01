import { apiRequest } from '../../../axios/axiosController';

import types from './TYPES';

import { GET_USER_DATA } from '../../../axios/routesToServerApi';

const { USER_REQUEST, USER_ERROR, USER_SUCCESS, AUTH_LOGOUT } = types;

export default {
	[USER_REQUEST]: ({ commit, dispatch }) =>
		new Promise(async (resolve, reject) => {
			apiRequest.defaults.headers.Authorization = `Bearer ${localStorage.getItem('user-token')}`;

			commit(USER_REQUEST);

			try {
				const resp = await apiRequest.get(GET_USER_DATA);
				commit(USER_SUCCESS, resp);
				dispatch(SET_TIMER);
				this.login = resp.data.name;

				const respMis = await apiRequest.get(MISSIONS);
				commit(SET_MISSIONS, respMis);

				// get first 10 messages to chat
				const { data: messagesForChat } = await apiRequest.get(CHAT_MESSAGES);

				for (let i = messagesForChat.length - 1; i >= 0; i--) {
					commit(CHAT_ADD_MESSAGE, { message: messagesForChat[i] });
				}

				// get player games
				const { data: playerGames } = await apiRequest.get(PLAYER_GAMES);
				commit(SET_PLAYER_GAMES, { playerGames });

				// get M10+ ticker
				const resTicker = await apiRequest(TOP_STRATEGIESTS);
				commit(SET_TOP_STRATEGIES_DATA, resTicker);

				resolve('rdy');
			} catch (e) {
				commit(USER_ERROR);
				dispatch(AUTH_LOGOUT);
				reject(e);
			}
		}),
};
