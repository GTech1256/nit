<template>
  <form @submit.prevent="sendRequest">
    <input type="email" v-model="email" required placeholder="email">
    <input
      type="password"
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
import { AUTH_SIGNIN } from '../axios/routesToServerApi.js';

export default {
	data() {
		return {
			email: '',
			password: '',
		};
	},
	methods: {
		sendRequest() {
			this.$apiRequest
				.post(AUTH_SIGNIN, {
					email: this.email,
					password: this.password,
				})
				.then(() => {
					alert('rdy');
					this.email = '';
					this.password = '';
				})
				.catch((e) => {
					alert('Error');
					console.log(e);
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





