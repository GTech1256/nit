export default {
  userProfile: state => state.profile,
  isProfileLoaded: state => state.profile && !!state.profile.email,
  userFiles: state => state.profile.files,
};
