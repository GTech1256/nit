<template>
  <form @submit.prevent="sendRequest">
    <input
      type="text"
      v-model="firstName"
      pattern="^[a-zA-Z0-9_-]{3,}$"
      placeholder="Имя..."
      required
    >
    <input
      type="text"
      v-model="lastName"
      pattern="^[a-zA-Z0-9_-]{3,}$"
      placeholder="Фамилия..."
      required
    >
    <input
      type="text"
      v-model="subName"
      pattern="^[a-zA-Z0-9_-]{3,}$"
      placeholder="Отчество..."
      required
    >
    <input type="date" v-model="birth_at" pattern="[^@]+@[^@]+\.[a-zA-Z]{2,6}" required>
    <input type="email" v-model="email" required placeholder="email">
    <input
      type="password"
      v-model="password"
      pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
      title="Не менее восьми символов, содержащих хотя бы одну цифру и символы из верхнего и нижнего регистра"
      placeholder="password"
      required
      autocomplete
      ref="mainPassword"
    >
    <input
      type="password"
      v-model="confirmationPassword"
      pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
      title="Не менее восьми символов, содержащих хотя бы одну цифру и символы из верхнего и нижнего регистра"
      placeholder="password"
      required
      autocomplete
      @input="validateRepeatPassword($event)"
    >
    <input type="submit" name="Send">
  </form>
</template>
<script>
import { AUTH_SIGNUP } from '../../axios/routesToServerApi.js';

export default {
	data() {
		return {
			firstName: '',
			lastName: '',
			subName: '',
			birth_at: null,
			email: '',
			password: '',
			confirmationPassword: '',
		};
	},
	methods: {
		validateRepeatPassword({ target: input }) {
			if (this.$refs.mainPassword.value !== input.value) {
				input.setCustomValidity('Дополнительный пароль должен быть как основной');
			} else {
				input.setCustomValidity('');
			}
		},
		sendRequest() {
			this.$apiRequest
				.post(AUTH_SIGNUP, {
					firstName: this.firstName,
					lastName: this.lastName,
					subName: this.subName,
					birth_at: this.birth_at,
					email: this.email,
					password: this.password,
					confirmationPassword: this.confirmationPassword,
				})
				.then(() => {
					alert('rdy');
					this.firstName = '';
					this.lastName = '';
					this.subName = '';
					this.birth_at = '';
					this.email = '';
					this.password = '';
					this.confirmationPassword = '';
				})
				.catch((e) => {
					if (e.response.status === 418) {
						alert('Пользователь с таким email уже зарегестрирован');
					} else {
						alert('Error');
						console.log(e);
					}
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





