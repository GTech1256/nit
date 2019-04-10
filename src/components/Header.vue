<template>
   <b-navbar toggleable="lg" type="dark" variant="info">
    <b-navbar-brand :to="{ name: 'index' }">Главная</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item href="#">Пример</b-nav-item>
        <b-nav-item href="#" disabled>Пример</b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">

        
        <b-nav-item-dropdown right v-if="isProfileLoaded">
          <!-- Using 'button-content' slot -->
          <template slot="button-content"><em>{{ user.firstName }}</em></template>
          <b-dropdown-item :to="{ name: 'profile' }">Профиль</b-dropdown-item>
          <b-dropdown-item @click="logout()">Выйти</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item v-else-if="$route.name !== 'auth' " :to="{ name: 'auth'}">Войти</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>
<script>
import { mapState, mapGetters } from 'vuex';
import types from '../store/modules/user/TYPES';

export default {
	methods: {
		logout() {
			this.$store.dispatch(types.AUTH_LOGOUT).then(() => {
        this.$router.push({ name: 'index' })
      })
		},
	},
	computed: {
    ...mapGetters(['isProfileLoaded']),
		...mapState({
			user: state => state.user.profile
		})
	}
}
</script>

