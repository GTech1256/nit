import Router from 'koa-router';

import News from '../../db/models/News';

const router = new Router();


export default router
  .get('/', async (ctx, next) => {
    const newsOnPage = 10;
    const currentPage = ctx.state.joiValidValues.page - 1;

    ctx.body = {
      meta: {
        newsOnPage,
        currentPage,
      },
      data: await News.find().sort({ date: -1 }) .limit(newsOnPage).skip(currentPage * newsOnPage),
    };

    return next;
  });
