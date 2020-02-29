/* eslint-disable no-underscore-dangle */
import Router from 'koa-router';
import { uploadFileToFirebase, removeFileFromFirebase } from '../../utils/Firebase/Storage';
import News from '../../db/models/News';
import permission from '../../middlwares/permission';

const router = new Router();

export default router
  .put('/upload/image', permission(['superadmin', 'admin', 'moderator']), async (ctx) => {
    const { joiValidValues } = ctx.state;

    const article = await News.findById(joiValidValues._id);
    if (article.image.Key) {
      await removeFileFromFirebase(article.image.Key);
    }

    const image = await uploadFileToFirebase(ctx.request.files.image); // upload new image

    console.log(image);


    ctx.body = await News.findOneAndUpdate({ _id: joiValidValues._id }, {
      image,
    });
  })
  /**
   * EDIT article of news
   * @body { ?AWSS3Image:oldImage, String:title, String:text, Date:date, Boolean:isEditedImage, ?FormData:image }
   */
  .put('/upload/text', permission(['superadmin', 'admin', 'moderator']), async (ctx) => {
    ctx.body = await News.findOneAndUpdate({ _id: ctx.state.joiValidValues._id }, {
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
  .post('/upload/text', permission(['superadmin', 'admin', 'moderator']), async (ctx) => {
    ctx.body = await News.create({
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
    const { _id } = ctx.state.joiValidValues;
    const article = await News.findById(_id);

    if (!article) {
      return ctx.throw(404);
    }

    /* remove image from AWS */
    await removeFileFromFirebase(article.image.Key);

    await News.deleteOne({
      _id,
    });
  });
