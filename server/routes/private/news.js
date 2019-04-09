import Router from 'koa-router';

import { uploadFileToS3, removeFileToS3 } from '../../utils/AWS';

import News from '../../db/models/News';

import permission from '../../middlwares/permission';

const router = new Router();


export default router
  /**
   * EDIT article of news
   * @body { ?AWSS3Image:oldImage, String:title, String:text, Date:date, Boolean:isEditedImage, ?FormData:image }
   */
  .put('/', permission(['superadmin', 'admin', 'moderator']), async (ctx) => {
    let { image } = ctx.state.joiValidValues;

    if (ctx.state.joiValidValues.isEditedImage) {
      await removeFileToS3(ctx.state.joiValidValues.oldImage.Key);
      image = await uploadFileToS3(image); // upload new image if older changed
    }

    ctx.body = await News.findOneAndUpdate({ _id: ctx.state.joiValidValues.id }, {
      image,
      title: ctx.state.joiValidValues.title,
      text: ctx.state.joiValidValues.text,
      date: ctx.state.joiValidValues.date,
    });
  })
  /**
   * ADD new article of news
   * @body { ?FormData:image, String:title, String:text, ?Date:date }
   *
   * @return
   *    200 - <news>
   *    xxx -
   */
  .post('/', permission(['superadmin', 'admin', 'moderator']), async (ctx) => {
    ctx.body = await News.create({
      image: await uploadFileToS3(ctx.state.joiValidValues.image),
      title: ctx.state.joiValidValues.title,
      text: ctx.state.joiValidValues.text,
      date: ctx.state.joiValidValues.date,
    });
  })
  /**
   * DELETE article from news
   * @body { Number: id }
   *
   * @return 200|404
   */
  .delete('/', permission(['superadmin', 'admin', 'moderator']), async (ctx) => {
    const article = await News.findById(ctx.state.joiValidValues.id);

    if (!article) {
      return ctx.throw(404);
    }

    /* remove image from AWS */
    const { url } = await removeFileToS3(article.image.Key);

    ctx.body = await News.create({
      image: url,
      title: ctx.state.joiValidValues.title,
      text: ctx.state.joiValidValues.text,
      date: ctx.state.joiValidValues.date,
    });
  });
