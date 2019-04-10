<template>
  <form @submit.prevent="sendRequest">
    <input type="email" v-model="email" required placeholder="email">
    <input
      type="password"
      autocomplete
      v-model="password"
      pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
      title="Не менее восьми символов, содержащих хотя бы одну цифру и символы из верхнего и нижнего регистра"
      required
      placeholder="password"
    >
    <input type="submit" name="Send">
  </form>
</template>
<script>
import { AUTH_SIGNIN } from '../../axios/routesToServerApi.js';
import types from '../../store/modules/user/TYPES';

export default {
	data() {
		return {
			email: '',
			password: '',
		};
	},
	methods: {
		sendRequest() {
			this.$store.dispatch(types.AUTH_SIGNIN, {
				email: this.email,
				password: this.password,
			});
		},
	},
};
</script>
<style lang="scss">
input {
	padding: 10px;
	display: block;
	margin: auto;
	outline: none;
	&:invalid {
		border-color: red;
	}
	&:valid {
		border-color: green;
	}
}
</style>





