import koaSwagger from 'koa2-swagger-ui';
import bodyParser from 'koa-bodyparser';
import cookie from 'koa-cookie';
import helmet from 'koa-helmet';
import cors from '@koa/cors';
import json from 'koa-json';
import logger from 'koa-logger';
import path from 'path';
import serve from 'koa-static';
import historyApiFallback from 'koa2-history-api-fallback';
import Koa from 'koa';

import './db/index';

import routes from './routes';

const whitelistOfOriginsCors = [
  'http://nit.ru',
  'https://nit.ru',
  'http://localhost:3030',
  'http://localhost:3031',
];

if (process.env.WEBLINK_FOR_CORS) {
  whitelistOfOriginsCors.push(process.env.WEBLINK_FOR_CORS);
}

function checkOriginAgainstWhitelist(ctx) {
  const requestOrigin = ctx.accept.headers.origin;

  if (!whitelistOfOriginsCors.includes(requestOrigin)) {
    return ctx.throw(403, `🙈 ${requestOrigin} is not a valid origin`);
  }
  return requestOrigin;
}
const corsOptions = {
  origin: checkOriginAgainstWhitelist,
  credentials: true,
};

const app = new Koa();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body = {
        success: false,
        token: null,
        info: 'Protected resource, use Authorization header to get access',
      };
    } else {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit('error', err, ctx);
    }
  }
});

app.use(logger());
app.use(bodyParser()); // ctx.request.body;
app.use(cookie()); // ctx.cookie
app.use(helmet());

app.use(cors(corsOptions));

app.use(json());

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

app.use(routes);

app.use(historyApiFallback());
app.use(serve(path.resolve('dist/front')));
console.log('end');
export default app;
