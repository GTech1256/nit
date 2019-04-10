import Index from '../views/index/Index.vue';
import Profile from '../views/profile/index.vue';
import Authorization from '../views/authorization/Index.vue';

export default [
  {
    path: '/',
    name: 'index',
    component: Index,
  },

  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: '/auth',
    name: 'auth',
    component: Authorization,
  },
];
