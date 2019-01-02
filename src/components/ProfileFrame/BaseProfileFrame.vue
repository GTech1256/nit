<template>
  <div v-if="!isProfileLoaded">
    {{ $store.state.user }}
    <h2>{{ currentComponent === 'profile-signin' ? 'Войти' : 'Зарегестрироваться' }}</h2>
    <component :is="currentComponent"/>
    <button
      @click="changeComponent"
    >{{ currentComponent === 'profile-signin' ? 'Зарегестрироваться' : 'Войти' }}</button>
  </div>
  <Profile v-else/>
</template>
<script>
import { mapGetters } from 'vuex';
import ProfileSignin from './BaseProfileFrameSignin';
import ProfileSignup from './BaseProfileFrameSignup';
import Profile from './BaseProfileFrameProfile';
export default {
	components: {
		ProfileSignin,
		ProfileSignup,
		Profile,
	},
	data() {
		return {
			currentComponent: 'profile-signin',
		};
	},
	methods: {
		changeComponent() {
			this.currentComponent =
				this.currentComponent === 'profile-signin' ? 'profile-signup' : 'profile-signin';
		},
	},
	computed: {
		...mapGetters(['isProfileLoaded']),
	},
};
</script>
