import Router from 'koa-router';
import publicRoutes from './public';
import privateRoutes from './private';

const router = new Router({
  prefix: '/api',
});

router.use('/public', publicRoutes.routes());
router.use('/private', privateRoutes.routes());

export default router.routes();
