import Router from 'koa-router';

import authRoutes from './auth';
import newsRoutes from './news';

const privateAPI = new Router();

privateAPI.use('/auth', authRoutes.routes());
privateAPI.use('/news', newsRoutes.routes());

export default privateAPI;
