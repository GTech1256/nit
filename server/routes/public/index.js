import Router from 'koa-router';

import authRoutes from './auth';

const privateAPI = new Router();

privateAPI.use('/auth', authRoutes.routes());

export default privateAPI;
