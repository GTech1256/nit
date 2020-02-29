import cors from '@koa/cors';

const whitelistOfOriginsCors = [
  'http://nit.ru',
  'https://nit.ru',
  'http://localhost',
  'http://localhost:81',
  'http://localhost:8080',
  'https://localhost',
  'https://localhost:81',
  'http://192.168.56.1:8081',
  'http://192.168.56.1:8080',
];

function checkOriginAgainstWhitelist(ctx) {
  const requestOrigin = ctx.accept.headers.origin;

  if (process.env.ORIGIN_FOR_CORS && process.env.ORIGIN_FOR_CORS === requestOrigin) {
    return requestOrigin;
  }

  if (!whitelistOfOriginsCors.includes(requestOrigin)) {
    return ctx.throw(403, `🙈 ${requestOrigin} is not a valid origin`);
  }
  return requestOrigin;
}
const corsOptions = {
  origin: checkOriginAgainstWhitelist,
  credentials: true,
};

export default cors(corsOptions);
