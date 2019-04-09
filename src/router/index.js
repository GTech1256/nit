import Vue from 'vue';
import Router from 'vue-router';
import routes from './mainRoutes';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('user-token') === null) {
      next({
        name: 'index',
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
