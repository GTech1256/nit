import Router from 'koa-router';
import jwt from '../../middlwares/jwtCheckAndEncode';

import authRoutes from './auth';
import userRoutes from './user';
import filesRoutes from './files';

const privateAPI = new Router();

jwt(privateAPI);

privateAPI.use('/auth', authRoutes.routes());
privateAPI.use('/user', userRoutes.routes());
privateAPI.use('/files', filesRoutes.routes());

export default privateAPI;
