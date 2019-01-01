import types from './TYPES';

const {
	USER_REQUEST,
	USER_ERROR,
	USER_SUCCESS,
	AUTH_LOGOUT,
	SET_MISSIONS,
	UPDATE_PLAYER_STATUS,
	CHAT_ADD_MESSAGE,
	SET_PLAYER_GAMES,
	CHAT_EDIT_MESSAGE,
	CHAT_DELETE_MESSAGE,
} = types;

export default {
	[USER_REQUEST]: (state) => {
		state.status = 'loading';
		// Vue.set(state, 'profile', { data: { data: { name: '', avatar: { image: '' } } } });
	},
	[USER_SUCCESS]: (state, resp) => {
		state.status = 'success';
		Vue.set(state, 'profile', resp.data);
	},
	[USER_ERROR]: (state) => {
		state.status = 'error';
	},
	[AUTH_LOGOUT]: (state) => {
		state.profile = {};
	},
	[SET_MISSIONS]: (state, resp) => {
		state.missions = resp.data;
	},
	[SET_PLAYER_GAMES]: (state, { playerGames }) => {
		state.playerGames = playerGames;
	},

	[UPDATE_PLAYER_STATUS](
		state,
		{
 bet_type, currency, game_mode, use_s_statistic, use_v_statistic 
},
	) {
		state.profile.playerStatus.bet_type = bet_type;
		state.profile.playerStatus.currency = currency;
		state.profile.playerStatus.game_mode = game_mode;

		state.profile.playerStatus.use_s_statistic = use_s_statistic;
		state.profile.playerStatus.use_v_statistic = use_v_statistic;

		/*
		localStorage.bet_type = JSON.stringify(bet_type);
		localStorage.currency = JSON.stringify(currency);
		localStorage.game_mode = JSON.stringify(game_mode);
		*/
	},
	[CHAT_ADD_MESSAGE]: (state, { message }) => {
		state.chatMessages.push(message);
	},
	[CHAT_EDIT_MESSAGE]: (state, { message }) => {
		state.chatMessages = state.chatMessages.map(msg => (msg.id === message.id ? message : msg),);
	},
	[CHAT_DELETE_MESSAGE]: (state, { message }) => {
		state.chatMessages = state.chatMessages.filter(
			msg => msg.id !== message.id,
		);
	},
};
