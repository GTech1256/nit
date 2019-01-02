import Vue from 'vue';
import Vuex from 'vuex';

import user from './modules/user/index';
import flags from './modules/flags/index';

const debug = process.env.NODE_ENV !== 'production';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    flags,
  },
  strict: debug,
});
