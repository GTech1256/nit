<template>
  <form @submit.prevent="sendRequest">
    <input type="text" v-model="firstName" pattern="{4,}" placeholder="Имя..." required>
    <input type="text" v-model="lastName" pattern="{4,}" placeholder="Фамилия..." required>
    <input type="text" v-model="subName" pattern="{4,}" placeholder="Отчество..." required>
    <input type="date" v-model="birth_at" pattern="[^@]+@[^@]+\.[a-zA-Z]{2,6}" required>
    <input type="email" v-model="email" required placeholder="email">
    <input
      type="password"
      v-model="password"
      pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
      title="Не менее восьми символов, содержащих хотя бы одну цифру и символы из верхнего и нижнего регистра"
      placeholder="password"
      required
    >
    <input type="submit" name="Send">
  </form>
</template>
<script>
import { AUTH_SIGNUP } from '../axios/routesToServerApi.js';

export default {
	data() {
		return {
			firstName: '',
			lastName: '',
			subName: '',
			birth_at: null,
			email: '',
			password: '',
		};
	},
	methods: {
		sendRequest() {
			this.$apiRequest
				.post(AUTH_SIGNUP, {
					firstName: this.firstName,
					lastName: this.lastName,
					subName: this.subName,
					birth_at: this.birth_at,
					email: this.email,
					password: this.password,
				})
				.then(() => {
					alert('rdy');
					this.firstName = '';
					this.lastName = '';
					this.subName = '';
					this.birth_at = '';
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





