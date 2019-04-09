import Joi from 'joi';
import joiSchema from './joiSchema';

// const apiCodes = require('../misc/apiCodes/index');

/**
 * Joi Validator Middleware
 * Создает инстанцию Joi мидлвара
 *
 */

export default (ctx, next) => {
  const path = `${ctx.method}:${ctx.request.path.replace('/api/', '').replace(/\//g, '_')}`;
  const joiObject = joiSchema[path];


  if (!joiObject) {
    return next();
  }

  let copyOfObjectForValidate = {};

  if (typeof joiObject.objectIn === 'string') {
    joiObject.objectIn = [joiObject.objectIn];
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const field of joiObject.objectIn) {
    copyOfObjectForValidate = { ...copyOfObjectForValidate, ...ctx.request[field] };
  }

  const resultOfJoiValidate = Joi.validate(copyOfObjectForValidate, joiObject.rule);

  if (resultOfJoiValidate.error) {
    const message = process.env.NODE_ENV === 'production'
      ? resultOfJoiValidate.error.name
      : resultOfJoiValidate.error.details;
    ctx.body = { message };
    ctx.status = 403;

    // eslint-disable-next-line consistent-return
    return;
  }

  ctx.state.joiValidValues = resultOfJoiValidate.value;
  return next();
};
