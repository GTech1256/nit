export default {
	getPlayerStatus: (state) => state.profile.playerStatus,
	getProfile: (state) => state.profile,
	isProfileLoaded: (state) => !!state.profile.name,
};
