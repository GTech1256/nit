import Router from 'koa-router';
import jwt from 'koa-jwt';

import authRoutes from './auth';

const privateAPI = new Router();

privateAPI.use(jwt({ secret: process.env.SECRET_OR_KEY }));

privateAPI.use('/auth', authRoutes.routes());

export default privateAPI;
