import cors from '@koa/cors';

const whitelistOfOriginsCors = [
  'http://nit.ru',
  'https://nit.ru',
  'http://localhost',
  'http://localhost:81',
  'https://localhost',
  'https://localhost:81',
];

if (process.env.ORIGIN_FOR_CORS) {
  whitelistOfOriginsCors.push(process.env.ORIGIN_FOR_CORS);
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

export default cors(corsOptions);
