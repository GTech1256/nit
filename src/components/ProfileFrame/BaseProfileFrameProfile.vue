<template>
  <div>
    <h2>Добро пожаловать</h2>
    <p>{{ fullName }}</p>
    <p>{{ userProfile.email }}</p>
    <router-link :to="{ name: 'profile'}" tag="button">Профиль</router-link>
    <button @click="logout">Выйти</button>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import types from '../../store/modules/user/TYPES';

export default {
	methods: {
		logout() {
			this.$store.dispatch(types.AUTH_LOGOUT);
		},
	},
	computed: {
		fullName() {
			const { firstName, lastName, subName } = this.userProfile;
			return `${lastName} ${firstName} ${subName}`;
		},
		...mapGetters(['userProfile']),
	},
};
</script>
