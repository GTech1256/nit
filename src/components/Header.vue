<template>
   <header>
     <div class="header__head head">
       <img class="head__logo" src="../assets/nit_logo.jpg">
       <div class="head__text">
        <p class="head__special-text">
          Методическая служба<br>"Нижнекамский индустриальный техникум"
        </p>
        <p class="head__lower-text">Учимся вместе</p>
       </div>
       <img class="head__pic" src="../assets/globe.jpg">
     </div>
     <b-navbar class="bg-custom" toggleable="lg" type="dark">
      <div class="bg-custom__auto">
        <b-navbar-brand :to="{ name: 'index' }">Главная</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse">Меню</b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="color-custom">
            <b-nav-item class="color-custom" :to="{ name: isProfileLoaded ? 'profile' : 'auth' }">Личный кабинет</b-nav-item>
            <b-nav-item class="color-custom" href="#" disabled>Общая информация о методической работе</b-nav-item>
            <b-nav-item-dropdown text="More">
              <b-dropdown-item href="#" disabled>Учебно и научно-методическая работа</b-dropdown-item>
              <b-dropdown-item href="#" disabled>Кадровая политика</b-dropdown-item>
              <b-dropdown-item href="#" disabled>Внутритехникумовский контроль</b-dropdown-item>
              <b-dropdown-item href="#" disabled>Консультация</b-dropdown-item>
              <b-dropdown-item href="#" disabled>Полезные ссылки</b-dropdown-item>
              <b-dropdown-item href="#" disabled>Медиатеки</b-dropdown-item>
              <b-dropdown-item href="#" disabled>Опрос</b-dropdown-item>
              <b-dropdown-item href="#" disabled>Архив</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item v-if="isProfileLoaded" @click="logout">Выйти</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </div>
    </b-navbar>
  </header>
</template>
<script>
import { mapState, mapGetters } from 'vuex';
import types from '../store/modules/user/TYPES';

export default {
  methods: {
    logout() {
      this.$store.dispatch(types.AUTH_LOGOUT).then(() => {
        this.$router.push({ name: 'index' });
      });
    },
  },
  computed: {
    ...mapGetters(['isProfileLoaded']),
    ...mapState({
      user: state => state.user.profile,
    }),
  },
};
</script>

<style scoped>
.header__head {
  margin-bottom: 50px;
}

.head {
  display: flex;
  width: 100%;
  /* height: 250px; */
  flex-wrap: wrap;
}

.head__logo {
  width: 20%;
}

.head__text {
  display: flex;
  flex-direction: column;
  font-size: 40px;
  font-weight: bold;
  width: 60%;
  text-align: center;
}

.head__special-text {
  margin: auto 0;
  color: #2c4b60;
  text-shadow: rgba(255, 255, 255, .5) 0 1px, rgba(0, 0, 0, .5) 0 3px;
}

.head__lower-text {
  color: #3b698b;
}

.head__pic {
  width: 20%;
}

.bg-custom {
  padding-top: 0;
  padding-bottom: 0;
  background-color: #28475d;
}

.dropdown-menu {
  background-color: #28475d;
}

.bg-custom__auto {
  display: flex;
  margin: 0 auto;
}

.router-link-exact-active {
  background: #ef8017;
}

.color-custom *:not(.disabled) {
  color: white !important;
}
</style>
