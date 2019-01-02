import jwt from 'koa-jwt';

export default (router) => {
  router.use(jwt({ secret: process.env.SECRET_OR_KEY }));
  router.use((ctx, next) => {
    const b64string = ctx.request.headers.authorization.split('.')[1];
    const json = Buffer.from(b64string, 'base64').toString();
    ctx.state.user = JSON.parse(json);
    return next();
  });
};
