import koaSwagger from 'koa2-swagger-ui';
import bodyParser from 'koa-body';
import cookie from 'koa-cookie';
import helmet from 'koa-helmet';
import json from 'koa-json';
import logger from 'koa-logger';
import path from 'path';
import serve from 'koa-static';
import historyApiFallback from 'koa2-history-api-fallback';

import corsController from './CORS';
import joiController from './JOI/index';

export default (app) => {
  app.use(logger());
  app.use(json());
  app.use(bodyParser({ multipart: true })); // ctx.request.body;
  app.use(cookie()); // ctx.cookie
  app.use(helmet());

  app.use(corsController);
  app.use(joiController);

  app.on('error', (err) => {
    console.log('server error', err);
  });

  // SWAGGER
  if (process.env.NODE_ENV === 'development') {
    koaSwagger({
      routePrefix: '/swagger', // host at /swagger instead of default /docs
      /*
    swaggerOptions: {
      url: 'http://petstore.swagger.io/v2/swagger.json', // example path to json
    },
    */
    });
  }

  app.use(historyApiFallback());
  app.use(serve(path.resolve('dist/front')));
};
