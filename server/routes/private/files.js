import Router from 'koa-router';
import User from '../../db/models/User';
// import { uploadFileToS3, removeFileToS3 } from '../../utils/AWS';
import { uploadFileToFirebase, removeFileFromFirebase } from '../../utils/Firebase/Storage';

const router = new Router();

export default router
  .post('/upload', async (ctx, next) => {
    try {
      const { file } = ctx.request.files;
      file.name = `${ctx.state.user.email}_${Date.now()}|${file.name}`;
      const res = await uploadFileToFirebase(file);

      const data = {
        url: res.Location,
        name: res.key,
      };
      await User.findOneAndUpdate({ email: ctx.state.user.email }, { $push: { files: data } });
      ctx.status = 200;
      ctx.body = data;
      return next();
    } catch (e) {
      console.error(e);
      return ctx.throw('aws s3 error');
    }
  })
  .post('/remove', async (ctx, next) => {
    try {
      const { name } = ctx.request.body;

      await removeFileFromFirebase(name);
      await User.findOneAndUpdate({ email: ctx.state.user.email }, { $pull: { files: { name } } });

      ctx.status = 200;
      return next();
    } catch (e) {
      console.error(e);
      return ctx.throw('aws s3 error');
    }
  });
